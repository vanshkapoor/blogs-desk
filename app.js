var express        = require('express');
var app            = express();
var bodyparser     = require('body-parser');
var ejs            = require('ejs');
var methodoverride = require("method-override");
var mongoose       = require('mongoose');

mongoose.connect("mongodb://root:A1a2a3a4@ds233581.mlab.com:33581/mongoosetestvk",{ useNewUrlParser: true },function(err){
	if(err){
		console.log(err);
	}else{
		console.log("connected to database");
	}
});

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(methodoverride("_method"));

var blogschema = new mongoose.Schema({
	title:String,
	image:{ type:String,default:"https://cdn0.iconfinder.com/data/icons/PRACTIKA/256/user.png"},
	body:String,
	created: {type:Date, default: Date.now}
});

var blog = mongoose.model("blog",blogschema);

/* blog.create({
	title:"test blog",
	image:"https://cdn0.iconfinder.com/data/icons/PRACTIKA/256/user.png",
	body:"hello this is a bulog post"
}); */

//restful routes
app.get('/',function(req,res){
	res.redirect("/blogs");
});
app.get('/blogs',function(req,res){
blog.find({},function(err,blog){
	if(err){
		console.log("error");
	}else{
		res.render("index",{blog:blog});
	}
  });
});
//new route
app.get('/blogs/new',function(req,res){
	res.render('new');
});
//create route
app.post('/blogs',function(req,res){
	blog.create(req.body.blog , function(err,newblog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});

});

//show route
app.get("/blogs/:id",function(req,res){

	blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundblog})
		}
	});
});
//edit route
app.get("/blogs/:id/edit",function(req,res){
	blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.redirect("/blogs");
		}else{
			/* res.render("show",{blog:foundblog}) */
			res.render("edit",{blog:foundblog});
		}
	});
	
});
//update route
app.put("/blogs/:id",function(req,res){
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundblog){
		if(err){
			res.redirect('/blogs');
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});
app.delete("/blogs/:id",function(req,res){
	blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
				res.redirect('/blogs');
		}else{
				res.redirect('/blogs');
		}
	});

});



app.listen('8000',function(err){
	if(err){
		console.log(err);
	}else{
		console.log("running on port:8000");
	}
	
})