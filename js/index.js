//生成地图
var map = new AMap.Map("mode_map_container", {
	zoom: 11,
	center: [116.397428, 39.90923]
});

//创建控件对象
var scale = new AMap.Scale(),
	overView = new AMap.OverView(),
	toolbar = new AMap.ToolBar();
//将控件添加到地图
map.addControl(scale);
map.addControl(overView);
map.addControl(toolbar);

//地图中心城市
//setCity();

//地图中心点
//setCenter();

//为地图注册click事件获取鼠标点击出的经纬度坐标
var clickEventListener = map.on('click', function(e) {
	map.setZoomAndCenter(12, [e.lnglat.getLng(), e.lnglat.getLat()])
});

//设置小图标
var markers = [];
function creatMarker(mapLocation) {
	//清除页面当前已有小图标
	for (var i = 0; i < mapLocation.length; i++) {
		var marker = new AMap.Marker({
			position: [mapLocation[i].lng, mapLocation[i].lat],
			map: map,
			icon: "img/map1.ico"
		});
		markers.push(marker);
	}
};

//轮播图
$('.slide-inner').unslider({
	speed: 500, // 动画的滚动速度
	delay: 3000, //  每个滑块的停留时间
	complete: function() {}, //  每个滑块动画完成时调用的方法
	keys: false, //  是否支持键盘
	dots: true, //  是否显示翻页圆点
	fluid: false //  支持响应式设计（有可能会影响到响应式）
});

//监听右侧滚动条，触发事件
$(window).scroll(function() {
	//如果出现滚动显示回到顶部按钮
	if ($(this).scrollTop() > 0) {
		$(".return-a").css("visibility", "visible");
		// $(".right-service").css("position","fixed");
	} else if ($(this).scrollTop() == 0) {
		$(".return-a").css("visibility", "hidden");
	}
});

//创建全局变量，服务于模板函数
var parameters = [{
	eleId: ".cate-list-sub1", //请求修手机数据  页面DOM元素ID
	modelUrl: "temps/xiusjTmpe.html", //自定义模板路径
	ajaxUrl: "/aj_get_fault_group", //ajax请求url
	modelId: "xiuTmp", //模板中的ID名
	data: {
		group_type: 1
	}
}, {
	eleId: ".cate-list-sub3", //请求卖手机数据
	modelUrl: "temps/Tmpes.html",
	ajaxUrl: "/huishou/dogetpinpailist",
	modelId: "saleTmp"
}, {
	eleId: ".cate-list-sub4", //请求买手机数据
	modelUrl: "temps/Tmpes.html",
	ajaxUrl: "/liangpin/dogetpinpailist",
	modelId: "buyTmp"
}, {
	eleId: ".col-right-cnt1", //请求修电脑数据
	modelUrl: "temps/Tmpes.html",
	ajaxUrl: "/doGetPcFaultList",
	modelId: "xiuHtmp"
}, {
	eleId: ".col-right-cnt2",
	modelUrl: "temps/Tmpes.html",
	ajaxUrl: "/doGetPcFaultList",
	modelId: "xiuOtmp"
}, {
	eleId: "#hot-list", //请求热门手机模板
	modelUrl: "temps/hotTmp.html",
	ajaxUrl: "/doGetHotHsList",
	modelId: "hotTmp",
	data: {
		num: 5
	}
}, {
	eleId: "#es-list", //请求二手手机模板
	modelUrl: "temps/esTmp.html",
	ajaxUrl: "/dogethotlist",
	modelId: "esTmp",
	data: {
		num: 5
	}
}, {
	eleId: ".city-list", //请求城市列表模板
	modelUrl: "temps/cityTmp.html",
	ajaxUrl: "/getcitycode",
	modelId: "cityTmp"
}, {
	eleId: "#JsShopList", //请求商铺列表模板
	modelUrl: "temps/shopListTmp.html",
	ajaxUrl: "/shop",
	modelId: "shopListTmp",
	data: {
		city_id: "bei_jing",
		area_id: "",
		type_id: "",
		is_bzj: "",
		pagesize: 5,
		pn: 0
	}
}];
//创建全局变量，获取店铺列表的页数
var pageCount = "",
	mapLocation = [{}, {}, {}, {}, {}];

//创建请求数据，调用模板函数
function creatModel(parameters) {
	for (var i = 0; i < parameters.length; i++) {
		(function(i) {
			//请求数据
			$.ajax({
				url: parameters[i].ajaxUrl,
				dataType: "json",
				data: parameters[i].data,
				success: function(data) {
					//获取店铺列表总页数
					if (parameters[i].eleId == "#JsShopList") {
						pageCount = Math.ceil(data.page_count / 5);
						//获取店铺坐标,生成地图标记
						for (var k = 0; k < data.shop_data.length; k++) {
							mapLocation[k].lng = data.shop_data[k].map_longitude;
							mapLocation[k].lat = data.shop_data[k].map_latitude;
						}
						map.remove(markers);
						creatMarker(mapLocation);

						if (fyflag == false) {
							pageUtil("#spages", pageCount, 1);
							pageUtil("#mapPages", pageCount, 1);
						}
					}

					//只有点击的页码是页面上时或点击的是城市时才去重新刷新页面中的店铺列表
					if (mapflag == false) {
						$(parameters[i].eleId).load(parameters[i].modelUrl,data,function(){
							var htmlstr = baidu.template(parameters[i].modelId, data);
							$(this).html(htmlstr);
						})
					}
				}
			});
		})(i);
	};
};
//页面首次或重新加载，首次调用模板函数
creatModel(parameters);

//首次请求完数据之后，只保留店铺对象的值
parameters = [{
	eleId: "#JsShopList", //请求商铺列表模板
	modelUrl: "temps/shopListTmp.html",
	ajaxUrl: "/shop",
	modelId: "shopListTmp",
	data: {
		city_id: "bei_jing",
		area_id: "",
		type_id: "",
		is_bzj: "",
		pagesize: 5,
		pn: 0
	}
}];

//顶部修手机部分事件逻辑
$(".cate-list-main").on("mouseover", ".item", function() {
	$(this).find(".arrow-left").show().end().siblings().find(".arrow-left").hide();
	$(this).parent().next().show().find(".cate-list-item").eq($(this).index()).show().siblings().hide();
});

$(".cate-list-main").on("mouseout", ".item", function(e) {
	if (!$(e.relatedTarget).parents().is(".cate-list-main") && !$(e.relatedTarget).is(".cate-list-sub")) {
		$(this).find(".arrow-left").hide();
		$(this).parent().next().hide(200);
	}
});

$(".cate-list-sub").on("mouseout", function(e) {
	if (!$(e.relatedTarget).parents().is(".cate-list-sub") && !$(e.relatedTarget).is(".cate-list-sub") && !$(e.relatedTarget).is(".cate-list-main")) {
		$(this).hide(200);
		$(this).prev().find(".arrow-left").hide();
	};
});



//切换城市部分 jq逻辑
var topbcity = true;
//点击topbar切换城市列表出现
$(".topbar-citychange").on("click", function() {
	$("#pop-city").show().css({
		"left": "40px",
		"top": "26px"
	});
	//拼音中的第一个加入class名current
	$(".filter_bar").find("a").eq(0).addClass("current").siblings().removeClass();
	//city_wrap中第一个p显示，其余隐藏
	$(".city_wrap").find("p").eq(0).show().siblings().hide();
	//区县列表消失
	$(".sel-quxian-pannel").hide();
	topbcity = true;
});

//点击到店维修时北京的按钮，显示城市列表改变top值
$(".select-city").on("click", function() {
	$("#pop-city").css({
		"left": 0,
		"top": "1489px"
	}).show();
	//拼音中的第一个加入class名current
	$(".filter_bar").find("a").eq(0).addClass("current").siblings().removeClass();
	//city_wrap中第一个p显示，其余隐藏
	$(".city_wrap").find("p").eq(0).show().siblings().hide();
	//区县列表消失
	$(".sel-quxian-pannel").hide();
	topbcity = false;
});

//点击关闭按钮
$("#closeCity").on("click", function() {
	$("#pop-city").hide();
});

//翻页flag
var fyflag = false;
//点击拼音中的按钮动态显示相应城市
$("#pop-city").on("click", "a", function() {
	if ($(this).parent().prev().is("h4:contains('拼音')")) {
		//点击的是拼音行对应的a标签
		$(this).addClass("current").siblings().removeClass();
		//显示城市
		$(this).parent().next().find("p").eq($(this).index()).show().siblings().hide();
	} else {
		fyflag = false;
		mapflag = false;
		//点击的是城市对应的a标签
		if (topbcity) {
			//表示点击的是topbar按钮

			//替换topbar左侧文本中的值，刷新页面
			$(".topbar-city").html($(this).html());
			//替换到店维修下方的城市文本
			$(".select-city>.select-text").html($(this).html());
		} else {
			//表示点击的是到店维修下方的按钮

			//改变select-city中的文本值，刷新下方商铺信息
			$(".select-city>.select-text").html($(this).html());
		};

		//隐藏城市列表
		$("#pop-city").hide();

		//根据当前a标签中的data-citycode值获取区县列表
		var quStr = "http://bang.360.cn/aj/get_area/?citycode=" + $(this).attr("data-citycode") + "&callback=QXdata";
		//动态创建跨域功能的script标签
		$("<script>").prop("src", quStr).appendTo("head");
		QXdata;
		//将新增的script标签从head中移除
		$("head").find("script").last().remove();

		//点击城市获取相应的商铺信息,调用creatModel函数
		parameters[0].data.city_id = $(this).attr("data-citycode");
		//重置页码为0
		parameters[0].data.pn = 0;
		//重置区域为空
		parameters[0].data.area_id = "";
		creatModel(parameters);
		//设置map为相应的城市
		map.setCity($(this).text());
	}
});

//创建跨域数据请求成功后返回数据的回调函数
function QXdata(data) {
	//区县列表加载模板
	$(".select-list").load("temps/qxTmp.html", data, function() {
		var htmlstr = baidu.template("qxTmp", data);
		$(".select-list").html(htmlstr);
	});
};

//点击选择区县按钮，显示区县列表，隐藏城市列表
$(".select-quxian").on("click", function(e) {
	//如果是关闭按钮，隐藏区县
	if ($(e.target).is("#quxian-close")) {
		$(".sel-quxian-pannel").hide();
	} else {
		$(".sel-quxian-pannel").show();
		$("#pop-city").hide();
		//如果点击的是a标签，获取相应的商铺信息,调用creatModel函数
		fyflag = false;
		mapflag = false;
		if ($(e.target).is("a")) {
			parameters[0].data.area_id = $(e.target).attr("code");
			//重置页码为0
			parameters[0].data.pn = 0;
			creatModel(parameters);
			//设置map为相应的城市
			map.setCity($(e.target).text());
			$(".sel-quxian-pannel").hide();
		}
	};
});

//点击默认排行那行按钮
$(".shop-list-filter").on("click", function(e) {
	fyflag = false;
	mapflag = false;
	if ($(e.target).is("a")) {
		//如果是按成交量
		if ($(e.target).attr("data-type") == 1) {
			parameters[0].modelUrl = "temps/shopcTmp.html";
			parameters[0].modelId = "shopcTmp";
		} else {
			parameters[0].modelUrl = "temps/shopListTmp.html";
			parameters[0].modelId = "shopListTmp";
		}
		//获取当前元素的data-type的值
		parameters[0].data.type_id = $(e.target).attr("data-type");
		//重置页码为0
		parameters[0].data.pn = 0;
		//检查先行赔付按钮状态
		if ($(".chkbox").prop("checked") == true) {
			parameters[0].data.is_bzj = 1;
		} else {
			parameters[0].data.is_bzj = 0;
		}

		creatModel(parameters);
		//让当前a标签的li添加class名active，移除兄弟元素的class
		$(e.target).parent().addClass("active").siblings().removeClass("active");
	} else if ($(e.target).is(".btn-mode-map")) {
		//点击显示地图弹窗
		$(".mask").show();
		$("#panel-modeMapindex").show();
		//点击关闭按钮，隐藏地图弹窗
		$(".map-close").click(function() {
			$(".mask").hide();
			$("#panel-modeMapindex").hide();
		})
	} else if ($(e.target).is("input")) {
		//检查先行赔付按钮状态
		if ($(".chkbox").prop("checked") == true) {
			parameters[0].data.is_bzj = 1;
			creatModel(parameters);
		} else {
			parameters[0].data.is_bzj = 0;
			creatModel(parameters);
		}
	}
});

//分页函数
//创建mapflag，判定点击的页码是map弹窗上的，还是页面上的，在map弹窗上为true
var mapflag = false;
function pageUtil(pageId, pageCount, curPage) {

	$(pageId).attr("curPage", curPage);
	$(pageId).attr("pageCount", pageCount);
	// var pCount = parseInt($(pageId).attr("pageCount"));
	//处理分页栏按钮事件
	if ($(pageId).find("a").size() == 0) {
		$(pageId).on("click", "a", function(e) {
			var btnValue = $(this).text();
			switch (btnValue) {
				case "首页":
					if (pageId == "#spages") {
						parameters[0].data.pn = 0;
						pageUtil(pageId, parseInt($(pageId).attr("pageCount")), 1);
						pageUtil("#mapPages", parseInt($("#mapPages").attr("pageCount")), 1);
						mapflag = false;
					}else {
						parameters[0].data.pn = 0;
						pageUtil(pageId, parseInt($(pageId).attr("pageCount")), 1);
						mapflag = true;
					}
					break;
				case "尾页":
					if (pageId == "#spages") {
						parameters[0].data.pn = parseInt($(pageId).attr("pageCount")) - 1;
						pageUtil(pageId, parseInt($(pageId).attr("pageCount")), parseInt($(pageId).attr("pageCount")));
						pageUtil("#mapPages", parseInt($("#mapPages").attr("pageCount")), parseInt($("#mapPages").attr("pageCount")));
						mapflag = false;
					}else {
						parameters[0].data.pn = parseInt($(pageId).attr("pageCount")) - 1;
						pageUtil(pageId, parseInt($(pageId).attr("pageCount")), parseInt($(pageId).attr("pageCount")));
						mapflag = true;
					}
					break;
				case "«上一页":
					if (pageId == "#spages") {
						parameters[0].data.pn = parseInt($(pageId).attr("curPage")) - 2;
						pageUtil(pageId, parseInt($(pageId).attr("pageCount")), parseInt($(pageId).attr("curPage")) - 1);
						pageUtil("#mapPages", parseInt($(pageId).attr("pageCount")), parseInt($(pageId).attr("curPage")) - 1);
						mapflag = false;
					}else {
						parameters[0].data.pn = parseInt($(pageId).attr("curPage")) - 2;
						pageUtil(pageId, parseInt($(pageId).attr("pageCount")), parseInt($(pageId).attr("curPage")) - 1);
						mapflag = true;
					}
					break;
				case "下一页»":
					//改变页码值，调用函数，更新店铺
					if (pageId == "#spages") {
						parameters[0].data.pn = parseInt($(pageId).attr("curPage"));
						pageUtil(pageId, parseInt($(pageId).attr("pageCount")), parseInt($(pageId).attr("curPage")) + 1);
						pageUtil("#mapPages", parseInt($(pageId).attr("pageCount")), parseInt($(pageId).attr("curPage")) + 1);
						mapflag = false;
					}else {
						parameters[0].data.pn = parseInt($(pageId).attr("curPage"));
						pageUtil(pageId, parseInt($(pageId).attr("pageCount")), parseInt($(pageId).attr("curPage")) + 1);
						mapflag = true;
					}
					break;
				default:
					if (pageId == "#spages") {
						parameters[0].data.pn = parseInt($(this).text()) - 1;
						pageUtil(pageId, parseInt($(pageId).attr("pageCount")), parseInt($(this).text()));
						pageUtil("#mapPages", parseInt($(pageId).attr("pageCount")), parseInt($(this).text()));
						mapflag = false;
					}else {
						parameters[0].data.pn = parseInt($(this).text()) - 1;
						pageUtil(pageId, parseInt($(pageId).attr("pageCount")), parseInt($(this).text()));
						mapflag = true;
					}
					break;
			}
			fyflag = true;
			creatModel(parameters);
		})
	}

	//根据传入的当前页码判定使用模板
	var frame = "";
	if (curPage == 1 && parseInt($(pageId).attr("pageCount")) != 1) {
		frame = '<a href="javascript:;" class="next" data-pn="1">下一页»</a>';
	} else if (curPage > 1 && curPage <= 5 && curPage != parseInt($(pageId).attr("pageCount"))) {
		frame = '<a href="javascript:;" class="pre" data-pn=' + (curPage - 2) + '>«上一页</a>' + '&nbsp;' + '<a href="javascript:;" class="next" data-pn=' + curPage + '>下一页»</a>'
	} else if (curPage >= 6 && (curPage <= 10 || curPage >= parseInt($(pageId).attr("pageCount")) - 5) && curPage != parseInt($(pageId).attr("pageCount"))) {
		frame = '<a href="javascript:;" class="first" data-pn=' + 0 + '>首页</a>&nbsp;' + '<a href="javascript:;" class="pre" data-pn=' + (curPage - 2) + '>«上一页</a>&nbsp;' + '<a href="javascript:;" class="next" data-pn=' + curPage + '>下一页»</a>'
	} else if (curPage >= 11 && curPage < parseInt($(pageId).attr("pageCount")) - 5) {
		frame = '<a href="javascript:;" class="first" data-pn=' + 0 + '>首页</a>&nbsp;' + '<a href="javascript:;" class="pre" data-pn=' + (curPage - 2) + '>«上一页</a>&nbsp;' + '<a href="javascript:;" class="next" data-pn=' + curPage + '>下一页»</a>&nbsp;' + '<a href="javascript:;" class="last" data-pn=' + (parseInt($(pageId).attr("pageCount")) - 1) + '>尾页</a>'
	} else if (curPage >= 11 && curPage == parseInt($(pageId).attr("pageCount"))) {
		frame = '<a href="javascript:;" class="first" data-pn=' + 0 + '>首页</a>&nbsp;' + '<a href="javascript:;" class="pre" data-pn=' + (curPage - 2) + '>«上一页</a>&nbsp;'
	} else if (curPage == parseInt($(pageId).attr("pageCount")) && parseInt($(pageId).attr("pageCount")) < 6 && parseInt($(pageId).attr("pageCount")) != 1) {
		frame = '<a href="javascript:;" class="pre" data-pn=' + (curPage - 2) + '>«上一页</a>&nbsp;'
	}
	$(pageId).html(frame);

	//页码起始值
	var sIndex = curPage > 5 ? curPage - 4 : 1;
	//循环生成页码
	var numList = "";
	for (var n = 0; sIndex <= parseInt($(pageId).attr("pageCount")) && n < 10; n++) {
		if (sIndex == curPage) {
			numList += '<span>' + curPage + '</span>&nbsp;'
		} else {
			numList += '<a href="javascript:;" data-pn=' + (sIndex - 1) + '>' + sIndex + '</a>&nbsp;';
		}
		sIndex++;
	}
	//添加到页面
	//如果当前有下一页就添加到下一页之前
	if ($(pageId).find("a").is(".next")) {
		$(pageId).find(".next").before(numList);
	} else {
		$(pageId).find(".pre").after(numList);
	}

};