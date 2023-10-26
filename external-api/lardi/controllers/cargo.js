const axios = require('../axios')

const getCargos = async (req,res) =>{

    try {
        await axios
      .get("/proposals/my/cargoes/published?page=1&size=100&language=uk")
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
    
        console.log(error);
      });
    } catch (error) {
        console.log(error);
        res.json(error.data)
    }
}



module.exports = {
    getCargos
}