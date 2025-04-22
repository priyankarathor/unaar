const goldenvisa = require("../model/Goldenvisa");


exports.goldenvisaadd = async (req, res) => {
    try {
        const { title, subtitle, description, image, buttontitle } = req.body;
        const agenciedata = new goldenvisa({ title, subtitle, description, image, buttontitle });
        await agenciedata.save();
        res.status(201).send("goldenvisa saved successfully");
    } catch (error) {
        res.status(500).send("Something went wrong: " + error.message);
    }
};

exports.goldenvisaget = async (req,res) =>{
    try{
        const agenciedata = await goldenvisa.find();
        res.status(201).json(agenciedata);
    }catch(error){
        res.status(500).send("something want wrong " + error.message);
    }
}

exports.goldenvisaedit = async (req, res) => {
    try {
        const { title, subtitle, description, image, buttontitle } = req.body;
        const { id } = req.params;

        const editgoldenvisa = await goldenvisa.findByIdAndUpdate(
            id,
            { title, subtitle, description, image, buttontitle },
            { new: true }
        );

        if (!editgoldenvisa) return res.status(404).send('goldenvisa not found');
        
        res.status(200).json({ message: "goldenvisa updated successfully", updatedAgency: editgoldenvisa });
    } catch (error) {
        res.status(400).send('Something went wrong: ' + error.message);
    }
};

exports.goldenvisadelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await goldenvisa.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).send("User not found");
    res.status(200).json({ message: "goldenvisa deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
};
