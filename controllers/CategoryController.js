const category = require('../model/category');

//insert
exports.categoryinsert = async (req,res) =>{
    try{
        const {categorytype,categoryvalue,image,action} = req.body;
        const categorydata = new category({categorytype,categoryvalue,image,action});
        await categorydata.save();

        res.status(200).json({
            status : true,
            message : "category data insert",
            categoryinsert : categorydata
        });
    }catch (error){
        res.status(401).json({
            status : false,
            message : "category data not insert",
            categoryinsert : null
        });
    }
}

//read
exports.categoryget = async (req,res)=>{
    try{
        const categorydataget = await category.find();
        res.status(200).json({
            status : true,
            message : "category data fatch",
            categoryfatch : categorydataget
        });
    }catch(error){
        res.status(401).json({
            status : false,
            message : "category data not fatching",
            categoryfatch : null
        });
    }
}

//edit
exports.categoryedit = async (req, res) => {
    try {
        const { categorytype, categoryvalue, image, action } = req.body;
        const { id } = req.params;

        const categoryeditdata = await category.findByIdAndUpdate(
            id,
            { categorytype, categoryvalue, image, action },
            { new: true }
        );

        if (!categoryeditdata) {
            return res.status(404).json({
                status: false,
                message: "Category not found",
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: "Category updated successfully",
            data: categoryeditdata
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};
//delete
exports.categorydelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedcategory = await category.findByIdAndDelete(id);

        if (!deletedcategory) {
            return res.status(404).json({
                status: false,
                message: "Category not found",
                data: null
            });
        }

        res.status(200).json({
            status: true,
            message: "Category deleted successfully",
            data: deletedcategory
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Something went wrong: " + error.message,
            data: null
        });
    }
};
