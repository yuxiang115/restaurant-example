$(function(){
	
	//set nav-toggle action
	$(".navbar-toggle").blur(function(event){
		var screenWidth = window.innerWidth;
		if(screenWidth < 768){
			$("#collapsable-nav").collapse('hide');
		}
	});

  	// In Firefox and Safari, the click event doesn't retain the focus
  	// on the clicked button. Therefore, the blur event will not fire on
  	// user clicking somewhere else in the page and the blur event handler
  	// which is set up above will not be called.
 	// Refer to issue #28 in the repo.
  	// Solution: force focus on the element that the click event fired on
	$(".navbar-toggle").click(function(event){
		$(event.target).focus();
	});
});


(function (global){
	var dc = {};

	var homeHtml = "snippets/home-snippet.html";
	var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitleHtml = "snippets/categories-title-snippet.html";
	var categoryHtml = "snippets/category-snippet.html";
	var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
	var menuItemsTitleHtml = "snippets/menu-items-title.html";
	var menuItemHtml = "snippets/menu-item.html";

	//HTML Insertion Function
	var insertHtml = function(selector, html){
		var targetElement = document.querySelector(selector).innerHTML = html;
	};


	//Show loading image
	var showLoading = function(selector){
		html = "<div class='text-center'>"
		html += "<img src = 'images/ajax-loader.gif'></div>";
		insertHtml(selector, html);
	};


	// Return substitute of '{{propName}}'
	// with propValue in given 'string'
	var insertProperty = function (str, propName, propValue){
		var propToReplace = "{{" + propName + "}}";
		str = str.replace(new RegExp(propToReplace, "g"), propValue);
		return str;
	}

	//load page first
	document.addEventListener("DOMContentLoaded", function(event){
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(homeHtml, function(responseText){
			insertHtml("#main-content", responseText);
		}, false);
	});


	//load the menu categories view
	dc.loadMenuCategories = function(){
		showLoading("#main-content");
		switchMenuToActive();
		$ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
	};


	// Builds HTML for the categories page based on the data
	// from the server
	function buildAndShowCategoriesHTML(categories){
		$ajaxUtils.sendGetRequest(categoriesTitleHtml, function(categoriesTitleHtml){
			$ajaxUtils.sendGetRequest(categoryHtml, function(categoryHtml){
				var cetegoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
				insertHtml("#main-content", cetegoriesViewHtml);
			}, false);
		}, false);

	}


	//Construct categories html
	function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml){
		var finalHtml = categoriesTitleHtml + "<section class='row'>";

		for(var i = 0; i < categories.length; i++){
			//Insert category values
			var html = categoryHtml;
			var name = categories[i].name;
			var shortName = categories[i].short_name;

			html = insertProperty(html, "name", name);
			html = insertProperty(html, "short_name", shortName);

			finalHtml += html;
		}
		finalHtml += "<section>";
		return finalHtml;
	}

	/**********************Category Item**********************************/
	dc.loadMenuItems = function(categoryShort){
		showLoading("#main-content");
		switchMenuToActive();
		$ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort, buildAndShowMenuItemsHTML);
	};

	function buildAndShowMenuItemsHTML(categoryMenuItems){
		$ajaxUtils.sendGetRequest(menuItemsTitleHtml, function(menuItemsTitleHtml){
			$ajaxUtils.sendGetRequest(menuItemHtml, function(menuItemHtml){
				var html = buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
				insertHtml("#main-content", html);
			}, false);
		}, false);
	}

	function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml){
		menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
		menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);

		var finalHtml = menuItemsTitleHtml + "<section class='row'>";
		var menuItems = categoryMenuItems.menu_items;
		var catShortName = categoryMenuItems.category.short_name;

		for(var i = 0; i < menuItems.length; i++){
			var html = menuItemHtml;
			html = insertProperty(html, "short_name", menuItems[i].short_name);
			html = insertProperty(html, "name", menuItems[i].name);
			html = insertProperty(html, "catShortName", catShortName);
			html = insertProperty(html, "description", menuItems[i].description);
			html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
			html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
			html = insertItemPrice(html, "price_small", menuItems[i].price_small);
			html = insertItemPrice(html, "price_large", menuItems[i].price_large);

			if(i % 2 != 0){
				html += "<div class='clearfix visible-lg-block visible-md-block'></div>"
			}

			finalHtml += html;
		}
		finalHtml += "</section>";
		return finalHtml;
	}


	function insertItemPrice(html, pricePropName, priceValue){
		if(!priceValue){
			return insertProperty(html, pricePropName, "");
		}

		priceValue = "$" + priceValue.toFixed(2);
		html = insertProperty(html, pricePropName, priceValue);
		return html;
	}

	function insertItemPortionName(html, portionPropName, portionValue){
		if(!portionValue){
			return insertProperty(html, portionPropName, "");
		}

		portionValue = "(" + portionValue + ") ";
		html = insertProperty(html, portionPropName, portionValue);
		return html;
	}

	function switchMenuToActive(){
		var className = document.querySelector("#navHomeButton").className;
		className = className.replace(new RegExp("active", "g"), "");
		document.querySelector("#navHomeButton").className = className;

		className = document.querySelector("#navMenuButton").className;
		if(className.indexOf("active") == -1){
			className += " active";
			document.querySelector("#navMenuButton").className = className;
		}
	}


	global.$dc = dc;
})(window);
