$('.slide-inner').unslider({
	speed: 500,               // 动画的滚动速度
    delay: 3000,              //  每个滑块的停留时间
    complete: function() {},  //  每个滑块动画完成时调用的方法
    keys: false,               //  是否支持键盘
    dots: true,               //  是否显示翻页圆点
    fluid: false              //  支持响应式设计（有可能会影响到响应式）
});

//请求卖手机数据
$(".cate-list-sub3").load("temps/Tmpes.html",function(){
	//请求数据
	$.ajax({
		url:"data/getmaishouji.json",
		success: function(data){
			//使用百度模板
			var htmlstr = baidu.template("saleTmp",data);
			$(".cate-list-sub3").html(htmlstr);
		}
	})
});

//请求买手机数据
$(".cate-list-sub4").load("temps/Tmpes.html",function(){
	//请求数据
	$.ajax({
		url:"data/getbuyshouji.json",
		success:function(data){
			//使用百度模板
			var htmlstr = baidu.template("buyTmp",data);
			$(".cate-list-sub4").html(htmlstr);
		}
	});
});

//请求修电脑数据
$(".col-right-cnt1").load("temps/Tmpes.html",function(){
	$.ajax({
		url:"data/getPcfault.json",
		success:function(data){
			//使用百度模板
			var htmlstr = baidu.template("xiuHtmp",data);
			$(".col-right-cnt1").html(htmlstr);
		}
	});
});

$(".col-right-cnt2").load("temps/Tmpes.html",function(){
	$.ajax({
		url:"data/getPcfault.json",
		success:function(data){
			//使用百度模板
			var htmlstr = baidu.template("xiuOtmp",data);
			$(".col-right-cnt2").html(htmlstr);
		}
	});
})

//顶部修手机部分事件逻辑
$(".cate-list-main").on("mouseover",".item",function(){
	$(this).find(".arrow-left").show().end().siblings().find(".arrow-left").hide();
	$(this).parent().next().show().find(".cate-list-item").eq($(".cate-list-main li").index($(this))).show().siblings().hide();
});

$(".cate-list-main").on("mouseout",function(){
	$(this).find(".arrow-left").hide();
	$(this).next().hide();
})

$(".cate-list-sub").on({
	mouseover: function(){
		$(this).show();
	},
	mouseout: function(){
		$(this).hide();
	}
});