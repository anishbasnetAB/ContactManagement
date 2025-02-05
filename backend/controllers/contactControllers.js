const asyncHandler = require("express-async-handler");
const Contact = require("../model/contactModel");

//@desc Get Contacts
//@route GET /api/contacts
//@access public
const getContacts = asyncHandler(async(req, res)=>{
    const contacts = await Contact.find();
    res.status(200).json(contacts);
});

//@desc Get Contact individual
//@route GET /api/contacts/:id
//@access public
const getContact =asyncHandler( async(req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }
    res.status(200).json({message: "Getting an individual contact of ", contact});
});

//@desc Create Contacts
//@route POST /api/contacts
//@access public
const createContact = asyncHandler(async(req, res)=>{
    console.log(req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const contact = await Contact.create({
        name,
        email,
        phone
    })
    res.status(201).json({message:"Crating an User ", contact});
});


//@desc Update Contacts
//@route PUT /api/contacts/:id
//@access public
const updateContact = asyncHandler(async(req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.status(200).json({message: `Updating an individual id of ${req.params.id}, `, updateContact});
});


//@desc Delete Contacts
//@route DELETE /api/contacts/:id
//@access public
const deleteContact = asyncHandler(async(req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    await Contact.deleteOne();
    res.status(200).json({message: `Deleting an individual id of ${req.params.id}`, contact});
});


module.exports = {getContacts, getContact, createContact, updateContact, deleteContact}