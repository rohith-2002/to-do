const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

let workItems = ["ghfjhd"];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://rohith:test@cluster0.azqpkwd.mongodb.net/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name: "wlecome to to do list"
});
const item2 = new Item({
    name: "wlecome to to do list2"
});
const item3 = new Item({
    name: "wlecome to to do list3"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItems).then(function () {
//     console.log("Successfully saved defult items to DB");
// }).catch(function (err) {
//     console.log(err);
// });
let today = new Date();
let options = {
    weekday: "long",
    day: "numeric",
    month: "long",

};
let day = today.toLocaleDateString("en-us", options);


app.get("/", function (req, res) {


    Item.find({}).then(function (FoundItems) {
        if (FoundItems.length === 0) {
            Item.insertMany(defaultItems).then(function () {
                console.log("Successfully saved defult items to DB");
            }).catch(function (err) {
                console.log(err);
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "today", newListItems: FoundItems });
        }

    })

});

app.get("/:customListName", function (req, res) {
    const customListName = req.params.customListName;

    List.findOne({ name: customListName }).then(function (foundList) {
        if (!foundList) {
            const list = new List({
                name: customListName,
                items: defaultItems
            });
            list.save();
            res.redirect("/" + customListName);
        }
        else {
            res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
        }
    });
    // const list = new List({
    //     name: customListName,
    //     items: defaultItems
    // })
    // list.save();
});


app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });
    if (listName === "today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }).then(function (foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }


});
app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    Item.findByIdAndRemove(checkedItemId).then(function () {
        console.log("Successfully saved defult items to DB");
        res.redirect("/");
    }).catch(function (err) {
        console.log(err);
    });



});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "work list", newListItems: workItems });
})
app.post("/work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})

app.listen(process.env.PORT, function () {
    console.log("the server is at 3030");
});