
/*
 * GET home page.
 */
module.exports = {
    index: function(req,res){
        res.render('index.html');
    },
    chat : function(req,res){
        res.render('chat.html');
    }
}