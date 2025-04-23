const agencies = require("../model/Agencie");

exports.agenciesadd = async (req, res) => {
    try {
        const { image, link, agenciename } = req.body;
        const agenciedata = new agencies({ image, link, agenciename });
        await agenciedata.save();
        res.status(201).send("Agency saved successfully");
    } catch (error) {
        res.status(500).send("Something went wrong: " + error.message);
    }
};

exports.agenciesget = async (req,res) =>{
    try{
        const agenciedata = await agencies.find();
        res.status(201).json(agenciedata);
    }catch(error){
        res.status(500).send("something want wrong " + error.message);
    }
}

exports.agenciesedit = async (req, res) => {
    try {
        const { image, link, agenciename } = req.body;
        const { id } = req.params;

        const editagencies = await agencies.findByIdAndUpdate(
            id,
            { image, link, agenciename },
            { new: true }
        );

        if (!editagencies) return res.status(404).send('Agency not found');
        
        res.status(200).json({ message: "Agency updated successfully", updatedAgency: editagencies });
    } catch (error) {
        res.status(400).send('Something went wrong: ' + error.message);
    }
};

exports.agenciesdelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await agencies.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).send("User not found");
    res.status(200).json({ message: "agencies deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
};
