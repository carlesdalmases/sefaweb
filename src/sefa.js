/*!
* d3pie
* @author Ben Keen
* @version 0.1.8
* @date April 2015
* @repo http://github.com/benkeen/d3pie
*/
!function(a,b){"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?module.exports=b(require()):a.d3pie=b(a)}(this,function(){var a="d3pie",b="0.1.6",c=0,d={header:{title:{text:"",color:"#333333",fontSize:18,font:"arial"},subtitle:{text:"",color:"#666666",fontSize:14,font:"arial"},location:"top-center",titleSubtitlePadding:8},footer:{text:"",color:"#666666",fontSize:14,font:"arial",location:"left"},size:{canvasHeight:500,canvasWidth:500,pieInnerRadius:"0%",pieOuterRadius:null},data:{sortOrder:"none",ignoreSmallSegments:{enabled:!1,valueType:"percentage",value:null},smallSegmentGrouping:{enabled:!1,value:1,valueType:"percentage",label:"Other",color:"#cccccc"},content:[]},labels:{outer:{format:"label",hideWhenLessThanPercentage:null,pieDistance:30},inner:{format:"percentage",hideWhenLessThanPercentage:null},mainLabel:{color:"#333333",font:"arial",fontSize:10},percentage:{color:"#dddddd",font:"arial",fontSize:10,decimalPlaces:0},value:{color:"#cccc44",font:"arial",fontSize:10},lines:{enabled:!0,style:"curved",color:"segment"},truncation:{enabled:!1,truncateLength:30},formatter:null},effects:{load:{effect:"default",speed:1e3},pullOutSegmentOnClick:{effect:"bounce",speed:300,size:10},highlightSegmentOnMouseover:!0,highlightLuminosity:-.2},tooltips:{enabled:!1,type:"placeholder",string:"",placeholderParser:null,styles:{fadeInSpeed:250,backgroundColor:"#000000",backgroundOpacity:.5,color:"#efefef",borderRadius:2,font:"arial",fontSize:10,padding:4}},misc:{colors:{background:null,segments:["#2484c1","#65a620","#7b6888","#a05d56","#961a1a","#d8d23a","#e98125","#d0743c","#635222","#6ada6a","#0c6197","#7d9058","#207f33","#44b9b0","#bca44a","#e4a14b","#a3acb2","#8cc3e9","#69a6f9","#5b388f","#546e91","#8bde95","#d2ab58","#273c71","#98bf6e","#4daa4b","#98abc5","#cc1010","#31383b","#006391","#c2643f","#b0a474","#a5a39c","#a9c2bc","#22af8c","#7fcecf","#987ac6","#3d3b87","#b77b1c","#c9c2b6","#807ece","#8db27c","#be66a2","#9ed3c6","#00644b","#005064","#77979f","#77e079","#9c73ab","#1f79a7"],segmentStroke:"#ffffff"},gradient:{enabled:!1,percentage:95,color:"#000000"},canvasPadding:{top:5,right:5,bottom:5,left:5},pieCenterOffset:{x:0,y:0},cssPrefix:null},callbacks:{onload:null,onMouseoverSegment:null,onMouseoutSegment:null,onClickSegment:null}},e={initialCheck:function(a){var b=a.cssPrefix,c=a.element,d=a.options;if(!window.d3||!window.d3.hasOwnProperty("version"))return console.error("d3pie error: d3 is not available"),!1;if(!(c instanceof HTMLElement||c instanceof SVGElement))return console.error("d3pie error: the first d3pie() param must be a valid DOM element (not jQuery) or a ID string."),!1;if(!/[a-zA-Z][a-zA-Z0-9_-]*$/.test(b))return console.error("d3pie error: invalid options.misc.cssPrefix"),!1;if(!f.isArray(d.data.content))return console.error("d3pie error: invalid config structure: missing data.content property."),!1;if(0===d.data.content.length)return console.error("d3pie error: no data supplied."),!1;for(var e=[],g=0;g<d.data.content.length;g++)"number"!=typeof d.data.content[g].value||isNaN(d.data.content[g].value)?console.log("not valid: ",d.data.content[g]):d.data.content[g].value<=0?console.log("not valid - should have positive value: ",d.data.content[g]):e.push(d.data.content[g]);return a.options.data.content=e,!0}},f={addSVGSpace:function(a){var b=a.element,c=a.options.size.canvasWidth,d=a.options.size.canvasHeight,e=a.options.misc.colors.background,f=d3.select(b).append("svg:svg").attr("width",c).attr("height",d);return"transparent"!==e&&f.style("background-color",function(){return e}),f},whenIdExists:function(a,b){var c=1,d=1e3,e=setInterval(function(){document.getElementById(a)&&(clearInterval(e),b()),c>d&&clearInterval(e),c++},1)},whenElementsExist:function(a,b){var c=1,d=1e3,e=setInterval(function(){for(var f=!0,g=0;g<a.length;g++)if(!document.getElementById(a[g])){f=!1;break}f&&(clearInterval(e),b()),c>d&&clearInterval(e),c++},1)},shuffleArray:function(a){for(var b,c,d=a.length;0!==d;)c=Math.floor(Math.random()*d),d-=1,b=a[d],a[d]=a[c],a[c]=b;return a},processObj:function(a,b,c){return"string"==typeof b?f.processObj(a,b.split("."),c):1===b.length&&void 0!==c?(a[b[0]]=c,a[b[0]]):0===b.length?a:f.processObj(a[b[0]],b.slice(1),c)},getDimensions:function(a){var b=document.getElementById(a),c=0,d=0;if(b){var e=b.getBBox();c=e.width,d=e.height}else console.log("error: getDimensions() "+a+" not found.");return{w:c,h:d}},rectIntersect:function(a,b){var c=b.x>a.x+a.w||b.x+b.w<a.x||b.y+b.h<a.y||b.y>a.y+a.h;return!c},getColorShade:function(a,b){a=String(a).replace(/[^0-9a-f]/gi,""),a.length<6&&(a=a[0]+a[0]+a[1]+a[1]+a[2]+a[2]),b=b||0;for(var c="#",d=0;3>d;d++){var e=parseInt(a.substr(2*d,2),16);e=Math.round(Math.min(Math.max(0,e+e*b),255)).toString(16),c+=("00"+e).substr(e.length)}return c},initSegmentColors:function(a){for(var b=a.options.data.content,c=a.options.misc.colors.segments,d=[],e=0;e<b.length;e++)d.push(b[e].hasOwnProperty("color")?b[e].color:c[e]);return d},applySmallSegmentGrouping:function(a,b){var c;"percentage"===b.valueType&&(c=h.getTotalPieSize(a));for(var d=[],e=[],f=0,g=0;g<a.length;g++)if("percentage"===b.valueType){var i=a[g].value/c*100;if(i<=b.value){e.push(a[g]),f+=a[g].value;continue}a[g].isGrouped=!1,d.push(a[g])}else{if(a[g].value<=b.value){e.push(a[g]),f+=a[g].value;continue}a[g].isGrouped=!1,d.push(a[g])}return e.length&&d.push({color:b.color,label:b.label,value:f,isGrouped:!0,groupedData:e}),d},showPoint:function(a,b,c){a.append("circle").attr("cx",b).attr("cy",c).attr("r",2).style("fill","black")},isFunction:function(a){var b={};return a&&"[object Function]"===b.toString.call(a)},isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)}},g=function(){var a,b,c,d,e,f,h=arguments[0]||{},i=1,j=arguments.length,k=!1,l=Object.prototype.toString,m=Object.prototype.hasOwnProperty,n={"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regexp","[object Object]":"object"},o={isFunction:function(a){return"function"===o.type(a)},isArray:Array.isArray||function(a){return"array"===o.type(a)},isWindow:function(a){return null!==a&&a===a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return null===a?String(a):n[l.call(a)]||"object"},isPlainObject:function(a){if(!a||"object"!==o.type(a)||a.nodeType)return!1;try{if(a.constructor&&!m.call(a,"constructor")&&!m.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(b){return!1}var c;for(c in a);return void 0===c||m.call(a,c)}};for("boolean"==typeof h&&(k=h,h=arguments[1]||{},i=2),"object"==typeof h||o.isFunction(h)||(h={}),j===i&&(h=this,--i),i;j>i;i++)if(null!==(a=arguments[i]))for(b in a)c=h[b],d=a[b],h!==d&&(k&&d&&(o.isPlainObject(d)||(e=o.isArray(d)))?(e?(e=!1,f=c&&o.isArray(c)?c:[]):f=c&&o.isPlainObject(c)?c:{},h[b]=g(k,f,d)):void 0!==d&&(h[b]=d));return h},h={toRadians:function(a){return a*(Math.PI/180)},toDegrees:function(a){return a*(180/Math.PI)},computePieRadius:function(a){var b=a.options.size,c=a.options.misc.canvasPadding,d=b.canvasWidth-c.left-c.right,e=b.canvasHeight-c.top-c.bottom;"pie-center"!==a.options.header.location&&(e-=a.textComponents.headerHeight),a.textComponents.footer.exists&&(e-=a.textComponents.footer.h),e=0>e?0:e;var f,g,h=(e>d?d:e)/3;if(null!==b.pieOuterRadius)if(/%/.test(b.pieOuterRadius)){g=parseInt(b.pieOuterRadius.replace(/[\D]/,""),10),g=g>99?99:g,g=0>g?0:g;var i=e>d?d:e;if("none"!==a.options.labels.outer.format){var j=2*parseInt(a.options.labels.outer.pieDistance,10);i-j>0&&(i-=j)}h=Math.floor(i/100*g)/2}else h=parseInt(b.pieOuterRadius,10);/%/.test(b.pieInnerRadius)?(g=parseInt(b.pieInnerRadius.replace(/[\D]/,""),10),g=g>99?99:g,g=0>g?0:g,f=Math.floor(h/100*g)):f=parseInt(b.pieInnerRadius,10),a.innerRadius=f,a.outerRadius=h},getTotalPieSize:function(a){for(var b=0,c=0;c<a.length;c++)b+=a[c].value;return b},sortPieData:function(a){var b=a.options.data.content,c=a.options.data.sortOrder;switch(c){case"none":break;case"random":b=f.shuffleArray(b);break;case"value-asc":b.sort(function(a,b){return a.value<b.value?-1:1});break;case"value-desc":b.sort(function(a,b){return a.value<b.value?1:-1});break;case"label-asc":b.sort(function(a,b){return a.label.toLowerCase()>b.label.toLowerCase()?1:-1});break;case"label-desc":b.sort(function(a,b){return a.label.toLowerCase()<b.label.toLowerCase()?1:-1})}return b},getPieTranslateCenter:function(a){return"translate("+a.x+","+a.y+")"},calculatePieCenter:function(a){var b=a.options.misc.pieCenterOffset,c=a.textComponents.title.exists&&"pie-center"!==a.options.header.location,d=a.textComponents.subtitle.exists&&"pie-center"!==a.options.header.location,e=a.options.misc.canvasPadding.top;c&&d?e+=a.textComponents.title.h+a.options.header.titleSubtitlePadding+a.textComponents.subtitle.h:c?e+=a.textComponents.title.h:d&&(e+=a.textComponents.subtitle.h);var f=0;a.textComponents.footer.exists&&(f=a.textComponents.footer.h+a.options.misc.canvasPadding.bottom);var g=(a.options.size.canvasWidth-a.options.misc.canvasPadding.left-a.options.misc.canvasPadding.right)/2+a.options.misc.canvasPadding.left,h=(a.options.size.canvasHeight-f-e)/2+e;g+=b.x,h+=b.y,a.pieCenter={x:g,y:h}},rotate:function(a,b,c,d,e){e=e*Math.PI/180;var f=Math.cos,g=Math.sin,h=(a-c)*f(e)-(b-d)*g(e)+c,i=(a-c)*g(e)+(b-d)*f(e)+d;return{x:h,y:i}},translate:function(a,b,c,d){var e=h.toRadians(d);return{x:a+c*Math.sin(e),y:b-c*Math.cos(e)}},pointIsInArc:function(a,b,c){var d=c.innerRadius()(b),e=c.outerRadius()(b),f=c.startAngle()(b),g=c.endAngle()(b),h=a.x*a.x+a.y*a.y,i=Math.atan2(a.x,-a.y);return i=0>i?i+2*Math.PI:i,h>=d*d&&e*e>=h&&i>=f&&g>=i}},i={add:function(a,b,c){var d=i.getIncludes(c),e=a.options.labels,f=a.svg.insert("g","."+a.cssPrefix+"labels-"+b).attr("class",a.cssPrefix+"labels-"+b),g=f.selectAll("."+a.cssPrefix+"labelGroup-"+b).data(a.options.data.content).enter().append("g").attr("id",function(c,d){return a.cssPrefix+"labelGroup"+d+"-"+b}).attr("data-index",function(a,b){return b}).attr("class",a.cssPrefix+"labelGroup-"+b).style("opacity",0),h={section:b,sectionDisplayType:c};d.mainLabel&&g.append("text").attr("id",function(c,d){return a.cssPrefix+"segmentMainLabel"+d+"-"+b}).attr("class",a.cssPrefix+"segmentMainLabel-"+b).text(function(a,b){var c=a.label;return e.formatter?(h.index=b,h.part="mainLabel",h.value=a.value,h.label=c,c=e.formatter(h)):e.truncation.enabled&&a.label.length>e.truncation.truncateLength&&(c=a.label.substring(0,e.truncation.truncateLength)+"..."),c}).style("font-size",e.mainLabel.fontSize+"px").style("font-family",e.mainLabel.font).style("fill",e.mainLabel.color),d.percentage&&g.append("text").attr("id",function(c,d){return a.cssPrefix+"segmentPercentage"+d+"-"+b}).attr("class",a.cssPrefix+"segmentPercentage-"+b).text(function(b,c){var d=j.getPercentage(a,c,a.options.labels.percentage.decimalPlaces);return e.formatter?(h.index=c,h.part="percentage",h.value=b.value,h.label=d,d=e.formatter(h)):d+="%",d}).style("font-size",e.percentage.fontSize+"px").style("font-family",e.percentage.font).style("fill",e.percentage.color),d.value&&g.append("text").attr("id",function(c,d){return a.cssPrefix+"segmentValue"+d+"-"+b}).attr("class",a.cssPrefix+"segmentValue-"+b).text(function(a,b){return h.index=b,h.part="value",h.value=a.value,h.label=a.value,e.formatter?e.formatter(h,a.value):a.value}).style("font-size",e.value.fontSize+"px").style("font-family",e.value.font).style("fill",e.value.color)},positionLabelElements:function(a,b,c){i["dimensions-"+b]=[];var d=d3.selectAll("."+a.cssPrefix+"labelGroup-"+b);d.each(function(c,d){var e=d3.select(this).selectAll("."+a.cssPrefix+"segmentMainLabel-"+b),f=d3.select(this).selectAll("."+a.cssPrefix+"segmentPercentage-"+b),g=d3.select(this).selectAll("."+a.cssPrefix+"segmentValue-"+b);i["dimensions-"+b].push({mainLabel:null!==e.node()?e.node().getBBox():null,percentage:null!==f.node()?f.node().getBBox():null,value:null!==g.node()?g.node().getBBox():null})});var e=5,f=i["dimensions-"+b];switch(c){case"label-value1":d3.selectAll("."+a.cssPrefix+"segmentValue-"+b).attr("dx",function(a,b){return f[b].mainLabel.width+e});break;case"label-value2":d3.selectAll("."+a.cssPrefix+"segmentValue-"+b).attr("dy",function(a,b){return f[b].mainLabel.height});break;case"label-percentage1":d3.selectAll("."+a.cssPrefix+"segmentPercentage-"+b).attr("dx",function(a,b){return f[b].mainLabel.width+e});break;case"label-percentage2":d3.selectAll("."+a.cssPrefix+"segmentPercentage-"+b).attr("dx",function(a,b){return f[b].mainLabel.width/2-f[b].percentage.width/2}).attr("dy",function(a,b){return f[b].mainLabel.height})}},computeLabelLinePositions:function(a){a.lineCoordGroups=[],d3.selectAll("."+a.cssPrefix+"labelGroup-outer").each(function(b,c){return i.computeLinePosition(a,c)})},computeLinePosition:function(a,b){var c,d,e,f,g=j.getSegmentAngle(b,a.options.data.content,a.totalSize,{midpoint:!0}),i=h.rotate(a.pieCenter.x,a.pieCenter.y-a.outerRadius,a.pieCenter.x,a.pieCenter.y,g),k=a.outerLabelGroupData[b].h/5,l=6,m=Math.floor(g/90),n=4;switch(2===m&&180===g&&(m=1),m){case 0:c=a.outerLabelGroupData[b].x-l-(a.outerLabelGroupData[b].x-l-i.x)/2,d=a.outerLabelGroupData[b].y+(i.y-a.outerLabelGroupData[b].y)/n,e=a.outerLabelGroupData[b].x-l,f=a.outerLabelGroupData[b].y-k;break;case 1:c=i.x+(a.outerLabelGroupData[b].x-i.x)/n,d=i.y+(a.outerLabelGroupData[b].y-i.y)/n,e=a.outerLabelGroupData[b].x-l,f=a.outerLabelGroupData[b].y-k;break;case 2:var o=a.outerLabelGroupData[b].x+a.outerLabelGroupData[b].w+l;c=i.x-(i.x-o)/n,d=i.y+(a.outerLabelGroupData[b].y-i.y)/n,e=a.outerLabelGroupData[b].x+a.outerLabelGroupData[b].w+l,f=a.outerLabelGroupData[b].y-k;break;case 3:var p=a.outerLabelGroupData[b].x+a.outerLabelGroupData[b].w+l;c=p+(i.x-p)/n,d=a.outerLabelGroupData[b].y+(i.y-a.outerLabelGroupData[b].y)/n,e=a.outerLabelGroupData[b].x+a.outerLabelGroupData[b].w+l,f=a.outerLabelGroupData[b].y-k}"straight"===a.options.labels.lines.style?a.lineCoordGroups[b]=[{x:i.x,y:i.y},{x:e,y:f}]:a.lineCoordGroups[b]=[{x:i.x,y:i.y},{x:c,y:d},{x:e,y:f}]},addLabelLines:function(a){var b=a.svg.insert("g","."+a.cssPrefix+"pieChart").attr("class",a.cssPrefix+"lineGroups").style("opacity",0),c=b.selectAll("."+a.cssPrefix+"lineGroup").data(a.lineCoordGroups).enter().append("g").attr("class",a.cssPrefix+"lineGroup"),d=d3.svg.line().interpolate("basis").x(function(a){return a.x}).y(function(a){return a.y});c.append("path").attr("d",d).attr("stroke",function(b,c){return"segment"===a.options.labels.lines.color?a.options.colors[c]:a.options.labels.lines.color}).attr("stroke-width",1).attr("fill","none").style("opacity",function(b,c){var d=a.options.labels.outer.hideWhenLessThanPercentage,e=j.getPercentage(a,c,a.options.labels.percentage.decimalPlaces),f=null!==d&&d>e||""===a.options.data.content[c].label;return f?0:1})},positionLabelGroups:function(a,b){"none"!==a.options.labels[b].format&&d3.selectAll("."+a.cssPrefix+"labelGroup-"+b).style("opacity",0).attr("transform",function(c,d){var e,i;if("outer"===b)e=a.outerLabelGroupData[d].x,i=a.outerLabelGroupData[d].y;else{var k=g(!0,{},a.pieCenter);if(a.innerRadius>0){var l=j.getSegmentAngle(d,a.options.data.content,a.totalSize,{midpoint:!0}),m=h.translate(a.pieCenter.x,a.pieCenter.y,a.innerRadius,l);k.x=m.x,k.y=m.y}var n=f.getDimensions(a.cssPrefix+"labelGroup"+d+"-inner"),o=n.w/2,p=n.h/4;e=k.x+(a.lineCoordGroups[d][0].x-k.x)/1.8,i=k.y+(a.lineCoordGroups[d][0].y-k.y)/1.8,e-=o,i+=p}return"translate("+e+","+i+")"})},fadeInLabelsAndLines:function(a){var b="default"===a.options.effects.load.effect?a.options.effects.load.speed:1;setTimeout(function(){var b="default"===a.options.effects.load.effect?400:1;d3.selectAll("."+a.cssPrefix+"labelGroup-outer").transition().duration(b).style("opacity",function(b,c){var d=a.options.labels.outer.hideWhenLessThanPercentage,e=j.getPercentage(a,c,a.options.labels.percentage.decimalPlaces);return null!==d&&d>e?0:1}),d3.selectAll("."+a.cssPrefix+"labelGroup-inner").transition().duration(b).style("opacity",function(b,c){var d=a.options.labels.inner.hideWhenLessThanPercentage,e=j.getPercentage(a,c,a.options.labels.percentage.decimalPlaces);return null!==d&&d>e?0:1}),d3.selectAll("g."+a.cssPrefix+"lineGroups").transition().duration(b).style("opacity",1),f.isFunction(a.options.callbacks.onload)&&setTimeout(function(){try{a.options.callbacks.onload()}catch(b){}},b)},b)},getIncludes:function(a){var b=!1,c=!1,d=!1;switch(a){case"label":b=!0;break;case"value":c=!0;break;case"percentage":d=!0;break;case"label-value1":case"label-value2":b=!0,c=!0;break;case"label-percentage1":case"label-percentage2":b=!0,d=!0}return{mainLabel:b,value:c,percentage:d}},computeOuterLabelCoords:function(a){a.svg.selectAll("."+a.cssPrefix+"labelGroup-outer").each(function(b,c){return i.getIdealOuterLabelPositions(a,c)}),i.resolveOuterLabelCollisions(a)},resolveOuterLabelCollisions:function(a){if("none"!==a.options.labels.outer.format){var b=a.options.data.content.length;i.checkConflict(a,0,"clockwise",b),i.checkConflict(a,b-1,"anticlockwise",b)}},checkConflict:function(a,b,c,d){var e,g;if(!(1>=d)){var h=a.outerLabelGroupData[b].hs;if(!("clockwise"===c&&"right"!==h||"anticlockwise"===c&&"left"!==h)){var j="clockwise"===c?b+1:b-1,k=a.outerLabelGroupData[b],l=a.outerLabelGroupData[j],m={labelHeights:a.outerLabelGroupData[0].h,center:a.pieCenter,lineLength:a.outerRadius+a.options.labels.outer.pieDistance,heightChange:a.outerLabelGroupData[0].h+1};if("clockwise"===c){for(e=0;b>=e;e++)if(g=a.outerLabelGroupData[e],f.rectIntersect(g,l)){i.adjustLabelPos(a,j,k,m);break}}else for(e=d-1;e>=b;e--)if(g=a.outerLabelGroupData[e],f.rectIntersect(g,l)){i.adjustLabelPos(a,j,k,m);break}i.checkConflict(a,j,c,d)}}},adjustLabelPos:function(a,b,c,d){var e,f,g,h;h=c.y+d.heightChange,f=d.center.y-h,e=Math.sqrt(Math.abs(d.lineLength)>Math.abs(f)?d.lineLength*d.lineLength-f*f:f*f-d.lineLength*d.lineLength),g="right"===c.hs?d.center.x+e:d.center.x-e-a.outerLabelGroupData[b].w,a.outerLabelGroupData[b].x=g,a.outerLabelGroupData[b].y=h},getIdealOuterLabelPositions:function(a,b){var c=d3.select("#"+a.cssPrefix+"labelGroup"+b+"-outer").node();if(c){var d=c.getBBox(),e=j.getSegmentAngle(b,a.options.data.content,a.totalSize,{midpoint:!0}),f=a.pieCenter.x,g=a.pieCenter.y-(a.outerRadius+a.options.labels.outer.pieDistance),i=h.rotate(f,g,a.pieCenter.x,a.pieCenter.y,e),k="right";e>180?(i.x-=d.width+8,k="left"):i.x+=8,a.outerLabelGroupData[b]={x:i.x,y:i.y,w:d.width,h:d.height,hs:k}}}},j={create:function(a){var b=a.pieCenter,c=a.options.colors,d=a.options.effects.load,e=a.options.misc.colors.segmentStroke,f=a.svg.insert("g","#"+a.cssPrefix+"title").attr("transform",function(){return h.getPieTranslateCenter(b)}).attr("class",a.cssPrefix+"pieChart"),g=d3.svg.arc().innerRadius(a.innerRadius).outerRadius(a.outerRadius).startAngle(0).endAngle(function(b){return b.value/a.totalSize*2*Math.PI}),i=f.selectAll("."+a.cssPrefix+"arc").data(a.options.data.content).enter().append("g").attr("class",a.cssPrefix+"arc"),k=d.speed;"none"===d.effect&&(k=0),i.append("path").attr("id",function(b,c){return a.cssPrefix+"segment"+c}).attr("fill",function(b,d){var e=c[d];return a.options.misc.gradient.enabled&&(e="url(#"+a.cssPrefix+"grad"+d+")"),e}).style("stroke",e).style("stroke-width",1).transition().ease("cubic-in-out").duration(k).attr("data-index",function(a,b){return b}).attrTween("d",function(b){var c=d3.interpolate({value:0},b);return function(b){return a.arc(c(b))}}),a.svg.selectAll("g."+a.cssPrefix+"arc").attr("transform",function(b,c){var d=0;return c>0&&(d=j.getSegmentAngle(c-1,a.options.data.content,a.totalSize)),"rotate("+d+")"}),a.arc=g},addGradients:function(a){var b=a.svg.append("defs").selectAll("radialGradient").data(a.options.data.content).enter().append("radialGradient").attr("gradientUnits","userSpaceOnUse").attr("cx",0).attr("cy",0).attr("r","120%").attr("id",function(b,c){return a.cssPrefix+"grad"+c});b.append("stop").attr("offset","0%").style("stop-color",function(b,c){return a.options.colors[c]}),b.append("stop").attr("offset",a.options.misc.gradient.percentage+"%").style("stop-color",a.options.misc.gradient.color)},addSegmentEventHandlers:function(a){var b=d3.selectAll("."+a.cssPrefix+"arc,."+a.cssPrefix+"labelGroup-inner,."+a.cssPrefix+"labelGroup-outer");b.on("click",function(){var b,c=d3.select(this);if(c.attr("class")===a.cssPrefix+"arc")b=c.select("path");else{var d=c.attr("data-index");b=d3.select("#"+a.cssPrefix+"segment"+d)}var e=b.attr("class")===a.cssPrefix+"expanded";j.onSegmentEvent(a,a.options.callbacks.onClickSegment,b,e),"none"!==a.options.effects.pullOutSegmentOnClick.effect&&(e?j.closeSegment(a,b.node()):j.openSegment(a,b.node()))}),b.on("mouseover",function(){var b,c,d=d3.select(this);if(d.attr("class")===a.cssPrefix+"arc"?b=d.select("path"):(c=d.attr("data-index"),b=d3.select("#"+a.cssPrefix+"segment"+c)),a.options.effects.highlightSegmentOnMouseover){c=b.attr("data-index");var e=a.options.colors[c];b.style("fill",f.getColorShade(e,a.options.effects.highlightLuminosity))}a.options.tooltips.enabled&&(c=b.attr("data-index"),l.showTooltip(a,c));var g=b.attr("class")===a.cssPrefix+"expanded";j.onSegmentEvent(a,a.options.callbacks.onMouseoverSegment,b,g)}),b.on("mousemove",function(){l.moveTooltip(a)}),b.on("mouseout",function(){var b,c,d=d3.select(this);if(d.attr("class")===a.cssPrefix+"arc"?b=d.select("path"):(c=d.attr("data-index"),b=d3.select("#"+a.cssPrefix+"segment"+c)),a.options.effects.highlightSegmentOnMouseover){c=b.attr("data-index");var e=a.options.colors[c];a.options.misc.gradient.enabled&&(e="url(#"+a.cssPrefix+"grad"+c+")"),b.style("fill",e)}a.options.tooltips.enabled&&(c=b.attr("data-index"),l.hideTooltip(a,c));var f=b.attr("class")===a.cssPrefix+"expanded";j.onSegmentEvent(a,a.options.callbacks.onMouseoutSegment,b,f)})},onSegmentEvent:function(a,b,c,d){if(f.isFunction(b)){var e=parseInt(c.attr("data-index"),10);b({segment:c.node(),index:e,expanded:d,data:a.options.data.content[e]})}},openSegment:function(a,b){a.isOpeningSegment||(a.isOpeningSegment=!0,d3.selectAll("."+a.cssPrefix+"expanded").length>0&&j.closeSegment(a,d3.select("."+a.cssPrefix+"expanded").node()),d3.select(b).transition().ease(a.options.effects.pullOutSegmentOnClick.effect).duration(a.options.effects.pullOutSegmentOnClick.speed).attr("transform",function(b,c){var d=a.arc.centroid(b),e=d[0],f=d[1],g=Math.sqrt(e*e+f*f),h=parseInt(a.options.effects.pullOutSegmentOnClick.size,10);return"translate("+e/g*h+","+f/g*h+")"}).each("end",function(c,d){a.currentlyOpenSegment=b,a.isOpeningSegment=!1,d3.select(this).attr("class",a.cssPrefix+"expanded")}))},closeSegment:function(a,b){d3.select(b).transition().duration(400).attr("transform","translate(0,0)").each("end",function(b,c){d3.select(this).attr("class",""),a.currentlyOpenSegment=null})},getCentroid:function(a){var b=a.getBBox();return{x:b.x+b.width/2,y:b.y+b.height/2}},getSegmentAngle:function(a,b,c,d){var e,f=g({compounded:!0,midpoint:!1},d),h=b[a].value;if(f.compounded){e=0;for(var i=0;a>=i;i++)e+=b[i].value}"undefined"==typeof e&&(e=h);var j=e/c*360;if(f.midpoint){var k=h/c*360;j-=k/2}return j},getPercentage:function(a,b,c){var d=a.options.data.content[b].value/a.totalSize;return 0>=c?Math.round(100*d):(100*d).toFixed(c)}},k={offscreenCoord:-1e4,addTitle:function(a){a.svg.selectAll("."+a.cssPrefix+"title").data([a.options.header.title]).enter().append("text").text(function(a){return a.text}).attr({id:a.cssPrefix+"title","class":a.cssPrefix+"title",x:k.offscreenCoord,y:k.offscreenCoord}).attr("text-anchor",function(){var b;return b="top-center"===a.options.header.location||"pie-center"===a.options.header.location?"middle":"left"}).attr("fill",function(a){return a.color}).style("font-size",function(a){return a.fontSize+"px"}).style("font-family",function(a){return a.font})},positionTitle:function(a){var b,c=a.textComponents,d=a.options.header.location,e=a.options.misc.canvasPadding,f=a.options.size.canvasWidth,g=a.options.header.titleSubtitlePadding;b="top-left"===d?e.left:(f-e.right)/2+e.left,b+=a.options.misc.pieCenterOffset.x;var h=e.top+c.title.h;if("pie-center"===d)if(h=a.pieCenter.y,c.subtitle.exists){var i=c.title.h+g+c.subtitle.h;h=h-i/2+c.title.h}else h+=c.title.h/4;a.svg.select("#"+a.cssPrefix+"title").attr("x",b).attr("y",h)},addSubtitle:function(a){var b=a.options.header.location;a.svg.selectAll("."+a.cssPrefix+"subtitle").data([a.options.header.subtitle]).enter().append("text").text(function(a){return a.text}).attr("x",k.offscreenCoord).attr("y",k.offscreenCoord).attr("id",a.cssPrefix+"subtitle").attr("class",a.cssPrefix+"subtitle").attr("text-anchor",function(){var a;return a="top-center"===b||"pie-center"===b?"middle":"left"}).attr("fill",function(a){return a.color}).style("font-size",function(a){return a.fontSize+"px"}).style("font-family",function(a){return a.font})},positionSubtitle:function(a){var b,c=a.options.misc.canvasPadding,d=a.options.size.canvasWidth;b="top-left"===a.options.header.location?c.left:(d-c.right)/2+c.left,b+=a.options.misc.pieCenterOffset.x;var e=k.getHeaderHeight(a);a.svg.select("#"+a.cssPrefix+"subtitle").attr("x",b).attr("y",e)},addFooter:function(a){a.svg.selectAll("."+a.cssPrefix+"footer").data([a.options.footer]).enter().append("text").text(function(a){return a.text}).attr("x",k.offscreenCoord).attr("y",k.offscreenCoord).attr("id",a.cssPrefix+"footer").attr("class",a.cssPrefix+"footer").attr("text-anchor",function(){var b="left";return"bottom-center"===a.options.footer.location?b="middle":"bottom-right"===a.options.footer.location&&(b="left"),b}).attr("fill",function(a){return a.color}).style("font-size",function(a){return a.fontSize+"px"}).style("font-family",function(a){return a.font})},positionFooter:function(a){var b,c=a.options.footer.location,d=a.textComponents.footer.w,e=a.options.size.canvasWidth,f=a.options.size.canvasHeight,g=a.options.misc.canvasPadding;b="bottom-left"===c?g.left:"bottom-right"===c?e-d-g.right:e/2,a.svg.select("#"+a.cssPrefix+"footer").attr("x",b).attr("y",f-g.bottom)},getHeaderHeight:function(a){var b;if(a.textComponents.title.exists){var c=a.textComponents.title.h+a.options.header.titleSubtitlePadding+a.textComponents.subtitle.h;b="pie-center"===a.options.header.location?a.pieCenter.y-c/2+c:c+a.options.misc.canvasPadding.top}else if("pie-center"===a.options.header.location){var d=a.options.misc.canvasPadding.bottom+a.textComponents.footer.h;b=(a.options.size.canvasHeight-d)/2+a.options.misc.canvasPadding.top+a.textComponents.subtitle.h/2}else b=a.options.misc.canvasPadding.top+a.textComponents.subtitle.h;return b}},l={addTooltips:function(a){var b=a.svg.insert("g").attr("class",a.cssPrefix+"tooltips");b.selectAll("."+a.cssPrefix+"tooltip").data(a.options.data.content).enter().append("g").attr("class",a.cssPrefix+"tooltip").attr("id",function(b,c){return a.cssPrefix+"tooltip"+c}).style("opacity",0).append("rect").attr({rx:a.options.tooltips.styles.borderRadius,ry:a.options.tooltips.styles.borderRadius,x:-a.options.tooltips.styles.padding,opacity:a.options.tooltips.styles.backgroundOpacity}).style("fill",a.options.tooltips.styles.backgroundColor),b.selectAll("."+a.cssPrefix+"tooltip").data(a.options.data.content).append("text").attr("fill",function(b){return a.options.tooltips.styles.color}).style("font-size",function(b){return a.options.tooltips.styles.fontSize}).style("font-family",function(b){return a.options.tooltips.styles.font}).text(function(b,c){var d=a.options.tooltips.string;return"caption"===a.options.tooltips.type&&(d=b.caption),l.replacePlaceholders(a,d,c,{label:b.label,value:b.value,percentage:j.getPercentage(a,c,a.options.labels.percentage.decimalPlaces)})}),b.selectAll("."+a.cssPrefix+"tooltip rect").attr({width:function(b,c){var d=f.getDimensions(a.cssPrefix+"tooltip"+c);return d.w+2*a.options.tooltips.styles.padding},height:function(b,c){var d=f.getDimensions(a.cssPrefix+"tooltip"+c);return d.h+2*a.options.tooltips.styles.padding},y:function(b,c){var d=f.getDimensions(a.cssPrefix+"tooltip"+c);return-(d.h/2)+1}})},showTooltip:function(a,b){var c=a.options.tooltips.styles.fadeInSpeed;l.currentTooltip===b&&(c=1),l.currentTooltip=b,d3.select("#"+a.cssPrefix+"tooltip"+b).transition().duration(c).style("opacity",function(){return 1}),l.moveTooltip(a)},moveTooltip:function(a){d3.selectAll("#"+a.cssPrefix+"tooltip"+l.currentTooltip).attr("transform",function(b){var c=d3.mouse(this.parentNode),d=c[0]+a.options.tooltips.styles.padding+2,e=c[1]-2*a.options.tooltips.styles.padding-2;return"translate("+d+","+e+")"})},hideTooltip:function(a,b){d3.select("#"+a.cssPrefix+"tooltip"+b).style("opacity",function(){return 0}),d3.select("#"+a.cssPrefix+"tooltip"+l.currentTooltip).attr("transform",function(b,c){var d=a.options.size.canvasWidth+1e3,e=a.options.size.canvasHeight+1e3;return"translate("+d+","+e+")"})},replacePlaceholders:function(a,b,c,d){f.isFunction(a.options.tooltips.placeholderParser)&&a.options.tooltips.placeholderParser(c,d);var e=function(){return function(a){var b=arguments[1];return d.hasOwnProperty(b)?d[arguments[1]]:arguments[0]}};return b.replace(/\{(\w+)\}/g,e(d))}},m=function(i,j){if(this.element=i,"string"==typeof i){var k=i.replace(/^#/,"");this.element=document.getElementById(k)}var l={};g(!0,l,d,j),this.options=l,null!==this.options.misc.cssPrefix?this.cssPrefix=this.options.misc.cssPrefix:(this.cssPrefix="p"+c+"_",c++),e.initialCheck(this)&&(d3.select(this.element).attr(a,b),this.options.data.content=h.sortPieData(this),this.options.data.smallSegmentGrouping.enabled&&(this.options.data.content=f.applySmallSegmentGrouping(this.options.data.content,this.options.data.smallSegmentGrouping)),this.options.colors=f.initSegmentColors(this),this.totalSize=h.getTotalPieSize(this.options.data.content),n.call(this))};m.prototype.recreate=function(){e.initialCheck(this)&&(this.options.data.content=h.sortPieData(this),this.options.data.smallSegmentGrouping.enabled&&(this.options.data.content=f.applySmallSegmentGrouping(this.options.data.content,this.options.data.smallSegmentGrouping)),this.options.colors=f.initSegmentColors(this),this.totalSize=h.getTotalPieSize(this.options.data.content),n.call(this))},m.prototype.redraw=function(){this.element.innerHTML="",n.call(this)},m.prototype.destroy=function(){this.element.innerHTML="",d3.select(this.element).attr(a,null)},m.prototype.getOpenSegment=function(){var a=this.currentlyOpenSegment;if(null!==a&&"undefined"!=typeof a){var b=parseInt(d3.select(a).attr("data-index"),10);return{element:a,index:b,data:this.options.data.content[b]}}return null},m.prototype.openSegment=function(a){a=parseInt(a,10),0>a||a>this.options.data.content.length-1||j.openSegment(this,d3.select("#"+this.cssPrefix+"segment"+a).node())},m.prototype.closeSegment=function(){var a=this.currentlyOpenSegment;a&&j.closeSegment(this,a)},m.prototype.updateProp=function(a,b){switch(a){case"header.title.text":var c=f.processObj(this.options,a);f.processObj(this.options,a,b),d3.select("#"+this.cssPrefix+"title").html(b),(""===c&&""!==b||""!==c&&""===b)&&this.redraw();break;case"header.subtitle.text":var d=f.processObj(this.options,a);f.processObj(this.options,a,b),d3.select("#"+this.cssPrefix+"subtitle").html(b),(""===d&&""!==b||""!==d&&""===b)&&this.redraw();break;case"callbacks.onload":case"callbacks.onMouseoverSegment":case"callbacks.onMouseoutSegment":case"callbacks.onClickSegment":case"effects.pullOutSegmentOnClick.effect":case"effects.pullOutSegmentOnClick.speed":case"effects.pullOutSegmentOnClick.size":case"effects.highlightSegmentOnMouseover":case"effects.highlightLuminosity":f.processObj(this.options,a,b);break;default:f.processObj(this.options,a,b),this.destroy(),this.recreate()}};var n=function(){this.svg=f.addSVGSpace(this),this.textComponents={headerHeight:0,title:{exists:""!==this.options.header.title.text,h:0,w:0},subtitle:{exists:""!==this.options.header.subtitle.text,h:0,w:0},footer:{exists:""!==this.options.footer.text,h:0,w:0}},this.outerLabelGroupData=[],
this.textComponents.title.exists&&k.addTitle(this),this.textComponents.subtitle.exists&&k.addSubtitle(this),k.addFooter(this);var a=this;f.whenIdExists(this.cssPrefix+"footer",function(){k.positionFooter(a);var b=f.getDimensions(a.cssPrefix+"footer");a.textComponents.footer.h=b.h,a.textComponents.footer.w=b.w});var b=[];this.textComponents.title.exists&&b.push(this.cssPrefix+"title"),this.textComponents.subtitle.exists&&b.push(this.cssPrefix+"subtitle"),this.textComponents.footer.exists&&b.push(this.cssPrefix+"footer"),f.whenElementsExist(b,function(){if(a.textComponents.title.exists){var b=f.getDimensions(a.cssPrefix+"title");a.textComponents.title.h=b.h,a.textComponents.title.w=b.w}if(a.textComponents.subtitle.exists){var c=f.getDimensions(a.cssPrefix+"subtitle");a.textComponents.subtitle.h=c.h,a.textComponents.subtitle.w=c.w}if(a.textComponents.title.exists||a.textComponents.subtitle.exists){var d=0;a.textComponents.title.exists&&(d+=a.textComponents.title.h,a.textComponents.subtitle.exists&&(d+=a.options.header.titleSubtitlePadding)),a.textComponents.subtitle.exists&&(d+=a.textComponents.subtitle.h),a.textComponents.headerHeight=d}h.computePieRadius(a),h.calculatePieCenter(a),k.positionTitle(a),k.positionSubtitle(a),a.options.misc.gradient.enabled&&j.addGradients(a),j.create(a),i.add(a,"inner",a.options.labels.inner.format),i.add(a,"outer",a.options.labels.outer.format),i.positionLabelElements(a,"inner",a.options.labels.inner.format),i.positionLabelElements(a,"outer",a.options.labels.outer.format),i.computeOuterLabelCoords(a),i.positionLabelGroups(a,"outer"),i.computeLabelLinePositions(a),a.options.labels.lines.enabled&&"none"!==a.options.labels.outer.format&&i.addLabelLines(a),i.positionLabelGroups(a,"inner"),i.fadeInLabelsAndLines(a),a.options.tooltips.enabled&&l.addTooltips(a),j.addSegmentEventHandlers(a)})};return m});function FISHNET()
{
	this.cells = [];
};

function CELL(utmx, utmy)
{
	this.UTMX = utmx;
	this.UTMY = utmy;
};

CELL.prototype.get_polygonXY = function()
{
	var offset = sefa_config.fishnet_resolution/2;
	var xy = [];
	xy.push([this.UTMX-offset,this.UTMY-offset]);
	xy.push([this.UTMX-offset,this.UTMY+offset]);
	xy.push([this.UTMX+offset,this.UTMY+offset]);
	xy.push([this.UTMX+offset,this.UTMY-offset]);
	xy.push([this.UTMX-offset,this.UTMY-offset]);
	return [xy];
}
function MANAGE_SD()
{
	//Eliminar NULL, compte! en queda un primer!
	this.sd = _.compact(sd_original);
		
	//Extreure la llista √∫nica de coordenades UTM1x1 i
	// crear la malla.
	_.forEach(_.uniqBy(this.sd, function(w){return w.UTMX+','+w.UTMY;}), function(c){
			fishnet.cells.push(new CELL(c.UTMX, c.UTMY));
		});	
};

MANAGE_SD.prototype.get_unique_protected_areas = function(){
	var w = [];
	_.forEach(_.uniqBy(this.sd, function(w){return w.ID_PARC;}), function(q){w.push(q.ID_PARC);});
	
	//Ordeno l'array de codis √∫nics segons l'ordre que vol el David. Si un codi no apareix a la llista
	//de codis ordenats, s'afegeix al final. Si s'afegeix a les dades un parc nou, s'haur√† d'actualizar el primer array!
	return _.union(['MTQ','GUI','MSY','SLL','MCO','SLI','SMA','COL','GRF','OLE'],w);
};


MANAGE_SD.prototype.get_locations_by_feature_name = function(feature_name){
	var coord = _.split(feature_name, ',');
	var cx = _.toNumber(coord[0]);
	var cy = _.toNumber(coord[1]);
	
	return _.orderBy(_.filter(this.sd, function(d) {return (d.UTMX == cx && d.UTMY == cy);}), 
					 ['ESPECIE', 'NUCLI_POBLACIONAL'], ['asc', 'asc']);	
};

MANAGE_SD.prototype.get_groupby_method = function(){
	
	var gd = new GRAPHDATA();
	
	_.forOwn(_.countBy(this.sd, 'METODOLOGIA_SEGUIMENT'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('OrRd');
};

MANAGE_SD.prototype.get_groupby_period = function(){
	
	var gd = new GRAPHDATA();
	
	_.forOwn(_.countBy(this.sd, 'PERIODICITAT'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('OrRd');
};

MANAGE_SD.prototype.get_groupby_species_by_protectedarea = function () {
	
	var gd = new GRAPHDATA();
	var p = _.groupBy(this.sd, 'ID_PARC');
	
	_.forEach(_.forOwn(p,function(value,key){
			var k = sefa_config.translates.get_translate(key);
			var v = _.uniqBy(value, 'ESPECIE').length;
			gd.set_graphdata(k,v);
		}));
	return gd.get_graphdata_colorbyvalue('Greens');
};


MANAGE_SD.prototype.get_groupby_locations_by_protectedarea = function () {
	
	var gd = new GRAPHDATA();
	
	_.forOwn(_.countBy(this.sd, 'ID_PARC'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('GnBu');
};

MANAGE_SD.prototype.get_groupby_species_by_protectionlevel = function () {
	var gd = new GRAPHDATA();
	_.forOwn(_.countBy(this.get_groupby_species_by_protectionlevel_list(), 'protection'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });

	return gd.get_graphdata_colorbyvalue('YlGn');
};

MANAGE_SD.prototype.get_groupby_species_by_protectionlevel_list = function () {
	
	var sps_protection = [];
	function SP_P(specie, protection)
	{
		this.sp = specie;
		this.protection = protection;
	}
	
	//A partir de la llista √∫nica d'esp√®cies (de totes les localitats) buscar la seva categoria de protecci√≥.
	//√âs necessari perqu√® hi ha esp√®cies (en localitats) que no estan al diccionari i cal indicar la seva
	//categoria de protecci√≥ per defecte --> EIL
	
	_.forEach(_.uniqBy(this.sd, 'ESPECIE'), function(s){
	
		var t = _.find(sd_tesaurus, function(x){return x.ESPECIE == s.ESPECIE});
		if(_.isUndefined(t))
		{
			//No la trobat, retorno value
			sps_protection.push(new SP_P(s.ESPECIE, 'EIL'));
		}
		else
		{
			sps_protection.push(new SP_P(s.ESPECIE, t.CATEGORIA));
		}
	});
	
	return _.orderBy(sps_protection, ['sp'], ['asc']);
};

MANAGE_SD.prototype.get_groupby_species_by_protectioncatalog = function () {
	var gd = new GRAPHDATA();
	_.forOwn(_.countBy(this.get_groupby_species_by_protectioncatalog_list(), 'protection'), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });
	return gd.get_graphdata_colorbyvalue('YlOrBr');
};

MANAGE_SD.prototype.get_groupby_species_by_protectioncatalog_list = function() {
	
	var sps_protection = [];
	function SP_P(specie, protection)
	{
		this.sp = specie;
		this.protection = protection;
	}
	
	//A partir de la llista √∫nica d'esp√®cies (de totes les localitats) buscar la seva categoria al Cat√†leg.
	//√âs necessari perqu√® hi ha esp√®cies (en localitats) que no estan al Cat√†leg i cal indicar la seva
	//categoria per defecte --> No present
	
	_.forEach(_.uniqBy(this.sd, 'ESPECIE'), function(s){
	
		var t = _.find(sd_tesaurus, function(x){return x.ESPECIE == s.ESPECIE});
		if(_.isUndefined(t))
		{
			//No l'ha trobat, retorno value
			sps_protection.push(new SP_P(s.ESPECIE, sefa_config.translates.get_translate('nopresent')));
		}
		else
		{
			//Es troba al Tesaurus, per√≤ pot no tenir categoria al CFAC
			if(t.CFAC == '0'){
				sps_protection.push(new SP_P(s.ESPECIE, sefa_config.translates.get_translate('nopresent')));
			}
			else {
				sps_protection.push(new SP_P(s.ESPECIE, sefa_config.translates.get_translate(t.CFAC)));
			}
		}
	});
	
	return _.orderBy(sps_protection, ['sp'], ['asc']);
};

MANAGE_SD.prototype.get_groupby_species_by_protectionlevel_protectioncatalog_list = function () {
	
	var sps_protection = [];
	function SP_P(specie, protectionlevel, protectioncatalog)
	{
		this.sp = specie;
		this.protectionlevel = protectionlevel;
		this.protectioncatalog = protectioncatalog;
	}
	
	//A partir de la llista √∫nica d'esp√®cies (de totes les localitats) buscar les seves categories de protecci√≥.
	//√âs necessari perqu√® hi ha esp√®cies (en localitats) que no estan al diccionari i cal indicar la seva
	//categoria de protecci√≥ per defecte --> EIL + No present
	
	_.forEach(_.uniqBy(this.sd, 'ESPECIE'), function(s){
	
		var t = _.find(sd_tesaurus, function(x){return x.ESPECIE == s.ESPECIE});
		if(_.isUndefined(t))
		{
			//No la trobat, retorno value
			sps_protection.push(new SP_P(s.ESPECIE, 'EIL', sefa_config.translates.get_translate('nopresent')));
		}
		else
		{
			if(t.CFAC == '0'){
				sps_protection.push(new SP_P(s.ESPECIE, t.CATEGORIA, sefa_config.translates.get_translate('nopresent')));
			}
			else {
				sps_protection.push(new SP_P(s.ESPECIE, t.CATEGORIA, sefa_config.translates.get_translate(t.CFAC)));
			}
		}
	});
	return _.orderBy(sps_protection, ['sp'], ['asc']);
};

MANAGE_SD.prototype.get_groupby_protectionlevel_from_tesaurus_list = function () {
	
	//A partir del diccionari d'esp√®cies i nivell de protecci√≥, fer un group by per 'CATEGORIA'
	return _.countBy(sd_tesaurus, 'CATEGORIA');
};

MANAGE_SD.prototype.get_groupby_protectionlevel_from_tesaurus = function () {
	var gd = new GRAPHDATA();
	_.forOwn(this.get_groupby_protectionlevel_from_tesaurus_list(), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });
	return gd.get_graphdata_colorbycategory_invert('RdPu');
};

MANAGE_SD.prototype.get_groupby_protectioncatalog_from_tesaurus_list = function () {
	
	//A partir del diccionari d'esp√®cies i nivell de protecci√≥ del cat√†leg, fer un group by per 'CFAC'
	return _.countBy(sd_tesaurus, 'CFAC');
};

MANAGE_SD.prototype.get_groupby_protectioncatalog_from_tesaurus = function () {
	var gd = new GRAPHDATA();
	_.forOwn(this.get_groupby_protectioncatalog_from_tesaurus_list(), 
			 function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key),value);
					  });
	return gd.get_graphdata_colorbycategory_invert('YlGnBu');
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates_acumulated = function () {

	return this.get_groupby_species_by_tracked_dates_acumulated_list();
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates_acumulated_list = function () {
	
	//A partir de les dades, per a cada esp√®cie, recollir la data m√≠nima i m√†xima de seguiment.
	var sps_times = [];
	function SP_T(specie, t0, t1)
	{
		this.sp = specie;
		this.t0 = t0;
		this.t1 = t1;
	}
	
	//Nom√©s aquelles localitats amb, com a m√≠nim, un cens
	var x  = _.filter(this.sd, function(o) { return o.N_CENSOS; });

	//Agrupar per esp√®cies i determinar la data m√≠nima i m√°xima dins de cada grup
	_.forEach(_.groupBy(x, 'ESPECIE'), function(w){
			
			//El nom de l'esp√®cie l'agafo del primer element de l'array
			sps_times.push(new SP_T(w[0].ESPECIE,
									(_.minBy(w, function(t){return moment(t.DATA_CENS_FIRST, 'DD-MM-YYYY').valueOf();})).DATA_CENS_FIRST, 
									(_.maxBy(w, function(t){return moment(t.DATA_CENS_LAST, 'DD-MM-YYYY').valueOf();})).DATA_CENS_LAST
									));
			});
	
	return _.orderBy(sps_times, ['sp'], ['asc']); 
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates = function () {

	return this.get_groupby_species_by_tracked_dates_list();
};

MANAGE_SD.prototype.get_groupby_species_by_tracked_dates_list = function () {
	
	//A partir de les dades, per a cada esp√®cie, recollir les dates de tots els censos.
	//Nom√©s aquelles localitats amb, com a m√≠nim, un cens
	return _.filter(this.sd, function(o) { return o.N_CENSOS; });
};

MANAGE_SD.prototype.get_groupby_species_by_num_locations_by_park = function (id_park) {
	return this.get_groupby_species_by_num_locations_list(id_park);
};

MANAGE_SD.prototype.get_groupby_species_by_num_locations = function () {
	return this.get_groupby_species_by_num_locations_list();
};
MANAGE_SD.prototype.get_groupby_species_by_num_locations_list = function (id_park) {
	
	//A partir de les dades, per a cada esp√®cie, comptar el total de localitats i les localitats amb censos
	var sps_locations = [];
	function SP_L(specie, locations_total, locations_census)
	{
		this.sp = specie;
		this.locations_total = locations_total;
		this.locations_census = locations_census;
	}

	if (_.isUndefined(id_park)){r = this.sd;}
	else {r = _.filter(this.sd,function(w){return _.isEqual(w.ID_PARC,id_park)});}

	//Agrupar per esp√®cies i comptar el num. total de localitats i de localitats amb censos.
	_.forEach(_.groupBy(r, 'ESPECIE'), function(w){
				var x = _.countBy(w, function(d){return !d.N_CENSOS?false:true;}).true;
				//El nom de l'esp√®cie l'agafo del primer element de l'array
				sps_locations.push(new SP_L(w[0].ESPECIE,
											w.length,
											_.isUndefined(x)?0:x));
			});
	return _.orderBy(sps_locations, ['sp'], ['asc']);
}; //get_groupby_species_by_num_locations_list

MANAGE_SD.prototype.get_groupby_species_by_num_census = function () {
	return this.get_groupby_species_by_num_census_list();
};
MANAGE_SD.prototype.get_groupby_species_by_num_census_list = function () {
	
	//A partir de les dades, per a cada esp√®cie, comptar el n√∫mero total de censos
	var sps_census = [];
	function SP_C(specie, census_total)
	{
		this.sp = specie;
		this.census_total = census_total;
	}

	//Agrupar per esp√®cies i comptar el n√∫mero total de censos
	_.forEach(_.groupBy(this.sd, 'ESPECIE'), function(w){
				var x = _.sumBy(w, 'N_CENSOS');
				//El nom de l'esp√®cie l'agafo del primer element de l'array
				sps_census.push(new SP_C(w[0].ESPECIE,_.sumBy(w, 'N_CENSOS')));
			});

	return _.orderBy(sps_census, ['sp'], ['asc']);
}; //get_groupby_species_by_num_locations_list

MANAGE_SD.prototype.get_protectedarea_species_locations = function (){
	return this.get_protectedarea_species_locations_list();
};

MANAGE_SD.prototype.get_protectedarea_species_locations_list = function (){
	function ALL_LOCATIONS (protectedarea, p_locations_total, p_locations_accumulated, specie, s_locations_total, s_locations_accumulated)
	{
		this.protectedarea = protectedarea;
		this.p_locations_total = p_locations_total;
		this.p_locations_accumulated = p_locations_accumulated;
		this.specie = specie;
		this.s_locations_total = s_locations_total;
		this.s_locations_accumulated = s_locations_accumulated;
	}
	
	function PSL_SPECIE (specie, locations_total, locations_accumulated)
	{	
		this.specie = specie;
		this.locations_total = locations_total;
		this.locations_accumulated = locations_accumulated;
	}

	function PSL (protectedarea, locations_total, locations_accumulated)
	{
		this.protectedarea = protectedarea;
		this.locations_total = locations_total;
		this.locations_accumulated = locations_accumulated;
		this.species = [];
	}
	
	var tpsl = {psl:[], pasl:[]};
	
	//Unique Species List
	tpsl.species_list = _.orderBy(_.uniqBy(this.sd, 'ESPECIE'), ['ESPECIE'],['asc']);
	
	_.forOwn(_.groupBy(this.sd, 'ID_PARC'),  function(value,key){
			
			//Total locations on ProtectedArea
			var i = tpsl.psl.push(new PSL(key,value.length,0));
			
			//Total locations by species on ProtectedArea
			_.forOwn(_.groupBy(value, 'ESPECIE'), function(value,key){
					tpsl.psl[i-1].species.push(new PSL_SPECIE(key, value.length,0));
			});
		});
	
	//Order By locations_total
	tpsl.psl = _.orderBy(tpsl.psl,['locations_total'],['desc']);
	
	//Order by locations_total on ProtectedArea
	_.forEach(tpsl.psl, function(d){
			d.species = _.orderBy(d.species,['locations_total','specie'],['desc','asc']);
		});
	
	//Accumulated calculate
	_.forEach(tpsl.psl, function(d,i){
			if(i){
				d.locations_accumulated = tpsl.psl[i-1].locations_accumulated + tpsl.psl[i-1].locations_total;
			};
			_.forEach(d.species, function(w,j){
				if(!j){
					w.locations_accumulated = d.locations_accumulated;
				}
				else{
					w.locations_accumulated = d.species[j-1].locations_accumulated + d.species[j-1].locations_total;
				}
			});
		});	
	
	//Flatten Global array
	_.forEach(tpsl.psl, function(d){
			_.forEach(d.species, function(w){
				tpsl.pasl.push(new ALL_LOCATIONS (d.protectedarea, d.locations_total, d.locations_accumulated, w.specie, w.locations_total, w.locations_accumulated));
				});
		});
	
	return tpsl;
};

//THREATS
MANAGE_SD.prototype.get_groupby_threats = function(){
	
	var gd = new GRAPHDATA();
	
	//Selecciono les amenaces, agrupo per par√†metre i calculo el total de VALOR (per cada par√†metre)
	_.forOwn(_.groupBy(_.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Amenaces');}), 'PARAMETRE'),function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key), _.sumBy(value, function(o) {return o.VALOR;}));
					  });

	return gd.get_graphdata_colorbyvalue('BuPu');
};

//IMPACTS
MANAGE_SD.prototype.get_groupby_impacts = function(){
	
	var gd = new GRAPHDATA();
	
	//Selecciono els impactes, agrupo per par√†metre i calculo el total de VALOR (per cada par√†metre)
	_.forOwn(_.groupBy(_.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Impactes');}), 'PARAMETRE'),function(value, key) {
  						gd.set_graphdata(sefa_config.translates.get_translate(key), _.sumBy(value, function(o) {return o.VALOR;}));
					  });

	return gd.get_graphdata_colorbyvalue('YlGn');
};

MANAGE_SD.prototype.get_impacts_peryear = function(){

	function DY (date,val)
	{
		this.date = date;
		this.val = val;
	};
		
	var g = {rx:[], ry:[], d:[], d_peryear:[], ry_d:[]};
	
	//Selecciono els impactes
	var p = _.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Impactes');});

	//Calculo els rangs de l'eix x,y
	//M√≠nim x
	g.rx.push(_.minBy(p, function(o){return o.DATA;}).DATA);
	
	//M√†xim x
	g.rx.push(_.maxBy(p, function(o){return o.DATA;}).DATA);
	
	//M√≠nim y
	g.ry.push(_.minBy(p, function(o){return o.VALOR;}).VALOR);
	
	//M√†xim y
	g.ry.push(_.maxBy(p, function(o){return o.VALOR;}).VALOR);
	
	//Agrupo per par√†metre
	g.d = _.groupBy(p, 'PARAMETRE');

	//Calculo el total d'impactes per any
	_.forOwn(_.groupBy(p, 'DATA'),function(value, key) {
  						g.d_peryear.push(new DY( _.toInteger(key), _.sumBy(value, function(o) {return o.VALOR;})));
					  });
	//Calculo el m√≠nim/m√†xim de la Y agrupada per anys
	g.ry_d.push(_.minBy(g.d_peryear, function(o){return o.val;}).val);
	g.ry_d.push(_.maxBy(g.d_peryear, function(o){return o.val;}).val);

	return g;
};

MANAGE_SD.prototype.get_threats_peryear = function(){

	function DY (date,val)
	{
		this.date = date;
		this.val = val;
	};
		
	var g = {rx:[], ry:[], d:[], d_peryear:[], ry_d:[]};
	
	//Selecciono els impactes
	var p = _.filter(sd_impactesamenaces, function(o) {return _.isEqual(o.GRUP, 'Amenaces');});

	//Calculo els rangs de l'eix x,y
	//M√≠nim x
	g.rx.push(_.minBy(p, function(o){return o.DATA;}).DATA);
	
	//M√†xim x
	g.rx.push(_.maxBy(p, function(o){return o.DATA;}).DATA);
	
	//M√≠nim y
	g.ry.push(_.minBy(p, function(o){return o.VALOR;}).VALOR);
	
	//M√†xim y
	g.ry.push(_.maxBy(p, function(o){return o.VALOR;}).VALOR);
	
	//Agrupo per par√†metre
	g.d = _.groupBy(p, 'PARAMETRE');

	//Calculo el total d'impactes per any
	_.forOwn(_.groupBy(p, 'DATA'),function(value, key) {
  						g.d_peryear.push(new DY( _.toInteger(key), _.sumBy(value, function(o) {return o.VALOR;})));
					  });
	//Calculo el m√≠nim/m√†xim de la Y agrupada per anys
	g.ry_d.push(_.minBy(g.d_peryear, function(o){return o.val;}).val);
	g.ry_d.push(_.maxBy(g.d_peryear, function(o){return o.val;}).val);

	return g;
};

MANAGE_SD.prototype.get_population_trend = function(){

	var sd = [];
	function SD (park,sp,date,val)
	{
		this.PARK = park;
		this.SP = sp;
		this.DATE = date;
		this.VAL = val;
	};

	//Agrupar per Parc
	_.forOwn(_.groupBy(sd_tendenciapobl, function(w){return _.split(w.IDMOSTREIG,'_')[0]}), function(value,key){
			//Parc
			var p=key;
			//Agrupar per esp√®cie
			_.forOwn(_.groupBy(value, function(w){return _.split(w.IDMOSTREIG,'_')[1]}),function(value,key){
				var sp = key;
				//Total anual
				_.forOwn(_.groupBy(value, function(w){return moment(_.split(w.IDMOSTREIG,'_')[3]).year();}), function(value,key){
					
					sd.push(new SD(p,
					   			   sp,
					   			   _.toInteger(key),
					   			   _.sumBy(value,function(w){return w.N;})));
				});
				
				
			});
		
	});
	return sd;
};

MANAGE_SD.prototype.get_population_trend_by_park = function(id_park){
	
	return _.filter(this.get_population_trend(), function(w){return _.isEqual(w.PARK, id_park)});
};

MANAGE_SD.prototype.get_anual_surveyed_localities = function(){
	
	var s  = {d:[], rx:[], ry:[]};
	function S(year,count){
		this.year = year;
		this.count = count;
	};
	
	_.forOwn(_.groupBy(sd_localitatscensadesany,function(w){return moment(w.DATE,'DD-MM-YYYY').year()}), function(value,key){
			s.d.push(new S(_.toInteger(key),value.length));
		});
	
	s.d = _.orderBy(s.d,'year');
	s.rx = [_.minBy(s.d,function(w){return w.year}).year,_.maxBy(s.d,function(w){return w.year}).year];
	s.ry = [_.minBy(s.d,function(w){return w.count}).count,_.maxBy(s.d,function(w){return w.count}).count];
	
	return s;
};function create_page()
{
	$('#body').append(
		"<div class='container-fluid'>"+

			"<script>function info_toggle(div){$(div).parent().next('div').toggle();}</script>"+
			"<script>function info_button_blur(div){$(div).blur();}</script>"+
			"<style>.info_text{border-color: rgb(221, 221, 221);border-width: 0.5px;border-style: solid;}</style>"+
			"<style>.btn-default{font-size: x-small}</style>"+

			"<div class='row'>"+
				"<div class='col-md-1'>"+
					"<button type='button' class='btn btn-default' onmouseover='info_toggle(this)' onmouseout='info_toggle(this)' onclick='info_button_blur(this)'>"+
					  "Ajuda"+
					"</button>"+
				"</div>"+
				"<div class='info_text' class='col-md-11' style='display:none'>XXX</div>"+
			"</div>"+			


			"<!-- MAPS -->"+
			"<div id='mapa_sefa_localitats_quadricula' class='panel panel-default'>"+
				"<div id='mapa_sefa_localitats_quadricula_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div id='mslq' class='map'></div>"+
				"</div>"+
			"</div>"+

			"<div class='row'>"+
				"<div class='col-md-1'>"+
					"<button type='button' class='btn btn-default' aria-label='Left Align' onmouseover='info_toggle(this)' onmouseout='info_toggle(this)' onclick='info_button_blur(this)'>"+
					  "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span>"+
					"</button>"+
				"</div>"+
				"<div class='info_text' class='col-md-11' style='display:none'>YYY</div>"+
			"</div>"+			


			
			"<!-- GRAPHS -->"+
			"<div id='sefa_graph' class='panel panel-default'>"+
				"<div id='sefa_graph_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_graphs_methods'></div>"+
						"<div id='sefa_graphs_protectedarea'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_protecionlevel'></div>"+
						"<div id='sefa_graphs_species_protectioncatalog'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_period'></div>"+
						"<div id='sefa_graphs_species_protectedarea'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_tracked_by_protectionlevel' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_tracked_by_protectioncatalog' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_species_tracked_by_tracked_dates_acumulated' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_groupby_species_by_num_locations' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_groupby_species_by_num_locations_by_park' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_groupby_species_by_num_census' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_protectedarea_species_locations' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_threats' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_impacts' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_impacts_year_series' class='col-md-12'></div>"+
						"<div id='sefa_graphs_impacts_year_totals' class='col-md-12'></div>"+
						"<div id='sefa_graphs_impacts_year_series_button_totals' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_threats_year_series' class='col-md-12'></div>"+
						"<div id='sefa_graphs_threats_year_totals' class='col-md-12'></div>"+
						"<div id='sefa_graphs_threats_year_series_button_totals' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+


					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_MCO_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_SLL_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_MSY_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_GRF_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_SLI_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_SMA_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_COL_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_OLE_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_population_trend_MTQ_' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+

					"<div class='row'>"+
						"<div id='sefa_graphs_anual_surveyed_localities' class='col-md-12'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+
			
			"<!-- TABLES -->"+
			"<div id='sefa_tables' class='panel panel-default'>"+
				"<div id='sefa_table_species_by_protectionlevel_list_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_table_species_by_protectionlevel_list'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+

			"<div id='sefa_tables' class='panel panel-default'>"+
				"<div id='sefa_table_species_by_protectioncatalog_list_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_table_species_by_protectioncatalog_list'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+


			"<div id='sefa_tables' class='panel panel-default'>"+
				"<div id='sefa_table_species_by_protectionlevel_protectioncatalog_list_heading' class='panel-heading'></div>"+
				"<div class='panel-body'>"+
					"<div class='row'>"+
						"<div id='sefa_table_species_by_protectionlevel_protectioncatalog_list'></div>"+
					"</div> <!-- End row -->"+
				"</div>"+
			"</div>"+


		"</div>" //container-fluid
	);
}


function SEFA_TABLES() {
}; //Fi de sefa_tables()


SEFA_TABLES.prototype.table_species_by_protectionlevel_list = function() {
	

	//Actualitzo el t√≠tol
	$('div#sefa_table_species_by_protectionlevel_list_heading').html('<h1 class="panel-title">'+_.capitalize(sefa_config.translates.get_translate('sefa_table_species_by_protectionlevel_list_heading'))+'</h1>');


	var list = manage_sd.get_groupby_species_by_protectionlevel_list();
	
	//groupBy
	_.forEach(_.sortBy(_.toPairs(_.groupBy(list, 'protection')), function(o){return o[1].length}), function(c){
			$newtable = $('<table/>')
					    .addClass('table')
					    .addClass('table-condensed');
		
			$newtable.append('<thead>'+
				'<tr>'+
					'<th>'+c[0]+'</th>'+
				'</tr>'+
			'</thead>'+
			'<tbody>'
			);
			
			_.forEach(c[1], function(q){
				
				$newtable.append('<tr>'+
						'<td class=\'specie\'>'+q.sp+'</td>'+
						'</tr>'
					);
				});

		$newtable.append('</tbody>');
	
		//Afegeixo la taula al DIV
		$newdivtable = $('<div/>')
						.addClass('col-md-3');
							
		$newdivtable.append($newtable);
		$('#sefa_table_species_by_protectionlevel_list').append($newdivtable);
		});
};

SEFA_TABLES.prototype.table_species_by_protectioncatalog_list = function() {
	
	//Actualitzo el t√≠tol
	$('div#sefa_table_species_by_protectioncatalog_list_heading').html('<h1 class="panel-title">'+sefa_config.translates.get_translate('sefa_table_species_by_protectioncatalog_list_heading')+'</h1>');
	
	var list = manage_sd.get_groupby_species_by_protectioncatalog_list();
	
	//groupBy
	_.forEach(_.sortBy(_.toPairs(_.groupBy(list, 'protection')), function(o){return o[1].length}), function(c){

			$newtable = $('<table/>')
					    .addClass('table')
					    .addClass('table-condensed');
		
			$newtable.append('<thead>'+
				'<tr>'+
					'<th>'+c[0]+'</th>'+
				'</tr>'+
			'</thead>'+
			'<tbody>'
			);
			
			_.forEach(c[1], function(q){
				
				$newtable.append('<tr>'+
						'<td class=\'specie\'>'+q.sp+'</td>'+
						'</tr>'
					);
				});

		$newtable.append('</tbody>');
	
		//Afegeixo la taula al DIV
		$newdivtable = $('<div/>')
						.addClass('col-md-3');
							
		$newdivtable.append($newtable);
		$('#sefa_table_species_by_protectioncatalog_list').append($newdivtable);
		});
};

SEFA_TABLES.prototype.table_species_by_protectionlevel_protectioncatalog_list = function() {
	
	//Actualitzo el t√≠tol
	$('div#sefa_table_species_by_protectionlevel_protectioncatalog_list_heading').html('<h1 class="panel-title">'+sefa_config.translates.get_translate('sefa_table_species_by_protectionlevel_protectioncatalog_list_heading')+'</h1>');
	
	var list = manage_sd.get_groupby_species_by_protectionlevel_protectioncatalog_list();
	
	$newtable = $('<table/>')
			    .addClass('table')
			    .addClass('table-condensed')
			    .addClass('table-striped');

	$newtable.append('<thead>'+
		'<tr>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('esp√®cie'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('protecionlevel'))+'</th>'+
			'<th>'+sefa_config.translates.get_translate('protecioncatalog')+'</th>'+
		'</tr>'+
	'</thead>'+
	'<tbody>'
	);

	_.forEach(list, function(q){
		$newtable.append('<tr ' + (q.protectionlevel=='EICP1'?'class=danger': (q.protectionlevel=='EICP2'?'class=warning':  (q.protectionlevel=='EIC'?'class=info':''))  ) +'>'+
				'<td class=\'specie\'>'+q.sp+'</td>'+
				'<td class=\'specie\'>'+q.protectionlevel+'</td>'+
				'<td class=\'specie\'>'+q.protectioncatalog+'</td>'+
				'</tr>'
			);
		});

	$newtable.append('</tbody>');
	
	//Afegeixo la taula al DIV
	$newdivtable = $('<div/>')
					.addClass('col-md-6');
						
	$newdivtable.append($newtable);
	$('#sefa_table_species_by_protectionlevel_protectioncatalog_list').append($newdivtable);
};
// This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
var colorbrewer = {YlGn: {
3: ["#f7fcb9","#addd8e","#31a354"],
4: ["#ffffcc","#c2e699","#78c679","#238443"],
5: ["#ffffcc","#c2e699","#78c679","#31a354","#006837"],
6: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"],
7: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
8: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
9: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"]
},YlGnBu: {
3: ["#edf8b1","#7fcdbb","#2c7fb8"],
4: ["#ffffcc","#a1dab4","#41b6c4","#225ea8"],
5: ["#ffffcc","#a1dab4","#41b6c4","#2c7fb8","#253494"],
6: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],
7: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],
8: ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],
9: ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]
},GnBu: {
3: ["#e0f3db","#a8ddb5","#43a2ca"],
4: ["#f0f9e8","#bae4bc","#7bccc4","#2b8cbe"],
5: ["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0868ac"],
6: ["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#43a2ca","#0868ac"],
7: ["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],
8: ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],
9: ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"]
},BuGn: {
3: ["#e5f5f9","#99d8c9","#2ca25f"],
4: ["#edf8fb","#b2e2e2","#66c2a4","#238b45"],
5: ["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"],
6: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],
7: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
8: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
9: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]
},PuBuGn: {
3: ["#ece2f0","#a6bddb","#1c9099"],
4: ["#f6eff7","#bdc9e1","#67a9cf","#02818a"],
5: ["#f6eff7","#bdc9e1","#67a9cf","#1c9099","#016c59"],
6: ["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#1c9099","#016c59"],
7: ["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],
8: ["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],
9: ["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"]
},PuBu: {
3: ["#ece7f2","#a6bddb","#2b8cbe"],
4: ["#f1eef6","#bdc9e1","#74a9cf","#0570b0"],
5: ["#f1eef6","#bdc9e1","#74a9cf","#2b8cbe","#045a8d"],
6: ["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#2b8cbe","#045a8d"],
7: ["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],
8: ["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],
9: ["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"]
},BuPu: {
3: ["#e0ecf4","#9ebcda","#8856a7"],
4: ["#edf8fb","#b3cde3","#8c96c6","#88419d"],
5: ["#edf8fb","#b3cde3","#8c96c6","#8856a7","#810f7c"],
6: ["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8856a7","#810f7c"],
7: ["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],
8: ["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],
9: ["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]
},RdPu: {
3: ["#fde0dd","#fa9fb5","#c51b8a"],
4: ["#feebe2","#fbb4b9","#f768a1","#ae017e"],
5: ["#feebe2","#fbb4b9","#f768a1","#c51b8a","#7a0177"],
6: ["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#c51b8a","#7a0177"],
7: ["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],
8: ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],
9: ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"]
},PuRd: {
3: ["#e7e1ef","#c994c7","#dd1c77"],
4: ["#f1eef6","#d7b5d8","#df65b0","#ce1256"],
5: ["#f1eef6","#d7b5d8","#df65b0","#dd1c77","#980043"],
6: ["#f1eef6","#d4b9da","#c994c7","#df65b0","#dd1c77","#980043"],
7: ["#f1eef6","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],
8: ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],
9: ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]
},OrRd: {
3: ["#fee8c8","#fdbb84","#e34a33"],
4: ["#fef0d9","#fdcc8a","#fc8d59","#d7301f"],
5: ["#fef0d9","#fdcc8a","#fc8d59","#e34a33","#b30000"],
6: ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"],
7: ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],
8: ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],
9: ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]
},YlOrRd: {
3: ["#ffeda0","#feb24c","#f03b20"],
4: ["#ffffb2","#fecc5c","#fd8d3c","#e31a1c"],
5: ["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"],
6: ["#ffffb2","#fed976","#feb24c","#fd8d3c","#f03b20","#bd0026"],
7: ["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],
8: ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],
9: ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]
},YlOrBr: {
3: ["#fff7bc","#fec44f","#d95f0e"],
4: ["#ffffd4","#fed98e","#fe9929","#cc4c02"],
5: ["#ffffd4","#fed98e","#fe9929","#d95f0e","#993404"],
6: ["#ffffd4","#fee391","#fec44f","#fe9929","#d95f0e","#993404"],
7: ["#ffffd4","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],
8: ["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],
9: ["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"]
},Purples: {
3: ["#efedf5","#bcbddc","#756bb1"],
4: ["#f2f0f7","#cbc9e2","#9e9ac8","#6a51a3"],
5: ["#f2f0f7","#cbc9e2","#9e9ac8","#756bb1","#54278f"],
6: ["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#756bb1","#54278f"],
7: ["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],
8: ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],
9: ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"]
},Blues: {
3: ["#deebf7","#9ecae1","#3182bd"],
4: ["#eff3ff","#bdd7e7","#6baed6","#2171b5"],
5: ["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"],
6: ["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"],
7: ["#eff3ff","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
8: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
9: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]
},Greens: {
3: ["#e5f5e0","#a1d99b","#31a354"],
4: ["#edf8e9","#bae4b3","#74c476","#238b45"],
5: ["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"],
6: ["#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"],
7: ["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],
8: ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],
9: ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]
},Oranges: {
3: ["#fee6ce","#fdae6b","#e6550d"],
4: ["#feedde","#fdbe85","#fd8d3c","#d94701"],
5: ["#feedde","#fdbe85","#fd8d3c","#e6550d","#a63603"],
6: ["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"],
7: ["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],
8: ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],
9: ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"]
},Reds: {
3: ["#fee0d2","#fc9272","#de2d26"],
4: ["#fee5d9","#fcae91","#fb6a4a","#cb181d"],
5: ["#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"],
6: ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"],
7: ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
8: ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
9: ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]
},Greys: {
3: ["#f0f0f0","#bdbdbd","#636363"],
4: ["#f7f7f7","#cccccc","#969696","#525252"],
5: ["#f7f7f7","#cccccc","#969696","#636363","#252525"],
6: ["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#636363","#252525"],
7: ["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],
8: ["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],
9: ["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"]
},PuOr: {
3: ["#f1a340","#f7f7f7","#998ec3"],
4: ["#e66101","#fdb863","#b2abd2","#5e3c99"],
5: ["#e66101","#fdb863","#f7f7f7","#b2abd2","#5e3c99"],
6: ["#b35806","#f1a340","#fee0b6","#d8daeb","#998ec3","#542788"],
7: ["#b35806","#f1a340","#fee0b6","#f7f7f7","#d8daeb","#998ec3","#542788"],
8: ["#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788"],
9: ["#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788"],
10: ["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],
11: ["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"]
},BrBG: {
3: ["#d8b365","#f5f5f5","#5ab4ac"],
4: ["#a6611a","#dfc27d","#80cdc1","#018571"],
5: ["#a6611a","#dfc27d","#f5f5f5","#80cdc1","#018571"],
6: ["#8c510a","#d8b365","#f6e8c3","#c7eae5","#5ab4ac","#01665e"],
7: ["#8c510a","#d8b365","#f6e8c3","#f5f5f5","#c7eae5","#5ab4ac","#01665e"],
8: ["#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e"],
9: ["#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e"],
10: ["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],
11: ["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"]
},PRGn: {
3: ["#af8dc3","#f7f7f7","#7fbf7b"],
4: ["#7b3294","#c2a5cf","#a6dba0","#008837"],
5: ["#7b3294","#c2a5cf","#f7f7f7","#a6dba0","#008837"],
6: ["#762a83","#af8dc3","#e7d4e8","#d9f0d3","#7fbf7b","#1b7837"],
7: ["#762a83","#af8dc3","#e7d4e8","#f7f7f7","#d9f0d3","#7fbf7b","#1b7837"],
8: ["#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837"],
9: ["#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837"],
10: ["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],
11: ["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"]
},PiYG: {
3: ["#e9a3c9","#f7f7f7","#a1d76a"],
4: ["#d01c8b","#f1b6da","#b8e186","#4dac26"],
5: ["#d01c8b","#f1b6da","#f7f7f7","#b8e186","#4dac26"],
6: ["#c51b7d","#e9a3c9","#fde0ef","#e6f5d0","#a1d76a","#4d9221"],
7: ["#c51b7d","#e9a3c9","#fde0ef","#f7f7f7","#e6f5d0","#a1d76a","#4d9221"],
8: ["#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221"],
9: ["#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221"],
10: ["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],
11: ["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"]
},RdBu: {
3: ["#ef8a62","#f7f7f7","#67a9cf"],
4: ["#ca0020","#f4a582","#92c5de","#0571b0"],
5: ["#ca0020","#f4a582","#f7f7f7","#92c5de","#0571b0"],
6: ["#b2182b","#ef8a62","#fddbc7","#d1e5f0","#67a9cf","#2166ac"],
7: ["#b2182b","#ef8a62","#fddbc7","#f7f7f7","#d1e5f0","#67a9cf","#2166ac"],
8: ["#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac"],
9: ["#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac"],
10: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],
11: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"]
},RdGy: {
3: ["#ef8a62","#ffffff","#999999"],
4: ["#ca0020","#f4a582","#bababa","#404040"],
5: ["#ca0020","#f4a582","#ffffff","#bababa","#404040"],
6: ["#b2182b","#ef8a62","#fddbc7","#e0e0e0","#999999","#4d4d4d"],
7: ["#b2182b","#ef8a62","#fddbc7","#ffffff","#e0e0e0","#999999","#4d4d4d"],
8: ["#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d"],
9: ["#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d"],
10: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],
11: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"]
},RdYlBu: {
3: ["#fc8d59","#ffffbf","#91bfdb"],
4: ["#d7191c","#fdae61","#abd9e9","#2c7bb6"],
5: ["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"],
6: ["#d73027","#fc8d59","#fee090","#e0f3f8","#91bfdb","#4575b4"],
7: ["#d73027","#fc8d59","#fee090","#ffffbf","#e0f3f8","#91bfdb","#4575b4"],
8: ["#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4"],
9: ["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4"],
10: ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],
11: ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]
},Spectral: {
3: ["#fc8d59","#ffffbf","#99d594"],
4: ["#d7191c","#fdae61","#abdda4","#2b83ba"],
5: ["#d7191c","#fdae61","#ffffbf","#abdda4","#2b83ba"],
6: ["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"],
7: ["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"],
8: ["#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd"],
9: ["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"],
10: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],
11: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]
},RdYlGn: {
3: ["#fc8d59","#ffffbf","#91cf60"],
4: ["#d7191c","#fdae61","#a6d96a","#1a9641"],
5: ["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"],
6: ["#d73027","#fc8d59","#fee08b","#d9ef8b","#91cf60","#1a9850"],
7: ["#d73027","#fc8d59","#fee08b","#ffffbf","#d9ef8b","#91cf60","#1a9850"],
8: ["#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850"],
9: ["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"],
10: ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],
11: ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]
},Accent: {
3: ["#7fc97f","#beaed4","#fdc086"],
4: ["#7fc97f","#beaed4","#fdc086","#ffff99"],
5: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0"],
6: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f"],
7: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17"],
8: ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]
},Dark2: {
3: ["#1b9e77","#d95f02","#7570b3"],
4: ["#1b9e77","#d95f02","#7570b3","#e7298a"],
5: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e"],
6: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"],
7: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d"],
8: ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]
},Paired: {
3: ["#a6cee3","#1f78b4","#b2df8a"],
4: ["#a6cee3","#1f78b4","#b2df8a","#33a02c"],
5: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99"],
6: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c"],
7: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f"],
8: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00"],
9: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6"],
10: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a"],
11: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99"],
12: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]
},Pastel1: {
3: ["#fbb4ae","#b3cde3","#ccebc5"],
4: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4"],
5: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6"],
6: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc"],
7: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd"],
8: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec"],
9: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]
},Pastel2: {
3: ["#b3e2cd","#fdcdac","#cbd5e8"],
4: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4"],
5: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9"],
6: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae"],
7: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc"],
8: ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"]
},Set1: {
3: ["#e41a1c","#377eb8","#4daf4a"],
4: ["#e41a1c","#377eb8","#4daf4a","#984ea3"],
5: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"],
6: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33"],
7: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628"],
8: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf"],
9: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]
},Set2: {
3: ["#66c2a5","#fc8d62","#8da0cb"],
4: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3"],
5: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"],
6: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"],
7: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"],
8: ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]
},Set3: {
3: ["#8dd3c7","#ffffb3","#bebada"],
4: ["#8dd3c7","#ffffb3","#bebada","#fb8072"],
5: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3"],
6: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462"],
7: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69"],
8: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5"],
9: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9"],
10: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd"],
11: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5"],
12: ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]
}};//Values of colorbrewer: view colorbrewer.js

function GRAPHCOLOR(n, id_colorbrewer)
{
	this.colorRamp = d3.scale.quantize()
							.domain([0,n])
							.range((_.toPairs(_.pick(colorbrewer, [id_colorbrewer])))[0][1][9]);

	this.colorRamp_invert = d3.scale.quantize()
							.domain([n,0])
							.range((_.toPairs(_.pick(colorbrewer, [id_colorbrewer])))[0][1][9]);

}

GRAPHCOLOR.prototype.get_colorRGB = function(i)
{
	return this.colorRamp(i);
}

GRAPHCOLOR.prototype.get_colorRGB_invert = function(i)
{
	return this.colorRamp_invert(i);
}


/*  ************************************************************************* */
/*  							GRAPHDATA									  */
/*  ************************************************************************* */
function GRAPHDATA()
{
	this.graphdata = [];
};
GRAPHDATA.prototype.get_graphdata_nocolor = function()
{
	return _.orderBy(this.graphdata,['value'],['desc']);
}

GRAPHDATA.prototype.get_graphdata_colorbyvalue = function(id_colorbrewer)
{
	//Pel propi valor
	if(!_.isUndefined(id_colorbrewer))
	{
		var c = new GRAPHCOLOR(_.maxBy(this.graphdata,'value').value, id_colorbrewer);
		_.forEach(this.graphdata, function(g,i){g.color = c.get_colorRGB(g.value);});
	}	
	return _.orderBy(this.graphdata,['value'],['desc']);
}

GRAPHDATA.prototype.get_graphdata_colorbycategory = function(id_colorbrewer)
{
	//Set Color
	//Per n√∫mero de categories
	
	var x = _.orderBy(this.graphdata,['value'],['desc']);
	
	if(!_.isUndefined(id_colorbrewer))
	{
		var c = new GRAPHCOLOR(this.graphdata.length, id_colorbrewer);
		_.forEach(x, function(g,i){g.color = c.get_colorRGB(i);});
	}
	return x;
}

GRAPHDATA.prototype.get_graphdata_colorbycategory_invert = function(id_colorbrewer)
{
	//Set Color
	//Per n√∫mero de categories
	
	var x = _.orderBy(this.graphdata,['value'],['desc']);
	
	if(!_.isUndefined(id_colorbrewer))
	{
		var c = new GRAPHCOLOR(this.graphdata.length, id_colorbrewer);
		_.forEach(x, function(g,i){g.color = c.get_colorRGB_invert(i);});
	}
	return x;
}



GRAPHDATA.prototype.set_graphdata = function(label,value)
{
	this.graphdata.push(new GD(label,value));
};

function GD(label,value)
{
	this.label = label;
	this.value = value;
	this.color;
};function GRAPH_SEFA(){};

function get_string_n_total(d)
{
	return ' ('+sefa_config.translates.get_translate('n_total')+_.sumBy(d, function(o) {return o.value;})+')';
};


GRAPH_SEFA.prototype.graph_by_method = function(){
	
	var div = 'sefa_graphs_methods';
	//if(!_.isUndefined(div)){return;}
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_method();
	
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('methods'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');
	return pie;
};

GRAPH_SEFA.prototype.graph_by_period = function(){
	
	var div = 'sefa_graphs_period';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_period();
	
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('periodicity'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');

	return pie;
};

GRAPH_SEFA.prototype.graph_species_by_protectedarea = function() {
	
	var div = 'sefa_graphs_species_protectedarea';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_species_by_protectedarea();

	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('species_by_protectedarea'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');

	return pie;
	
};

GRAPH_SEFA.prototype.graph_locations_by_protectedarea = function() {
	
	var div = 'sefa_graphs_protectedarea';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_locations_by_protectedarea();
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('locations_by_protectedarea'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');
	return pie;
	
};

GRAPH_SEFA.prototype.graph_species_by_protectionlevel = function() {

	var div = 'sefa_graphs_species_protecionlevel';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_groupby_species_by_protectionlevel();
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('species_protecionlevel'))+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');
	return pie;
	
};

GRAPH_SEFA.prototype.graph_species_by_protectioncatalog = function() {

	var div = 'sefa_graphs_species_protectioncatalog';
	if(!$('#'+div).length){return;}
	var d =  manage_sd.get_groupby_species_by_protectioncatalog();
	var defaults = pie_defaults();
	defaults.header.title.text = sefa_config.translates.get_translate('species_protectioncatalog')+get_string_n_total(d);
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+400+'px;'+'height:'+300+'px;');

	return pie;
	
};

//PIE GRAPH
function graph_pie_template(div, titol, dades)
{	
};
function pie_defaults()
{
return	{
		"header": {
			"title": {
				"text": '',
				"fontSize": 12,
				"font": "open sans"
			},
			"subtitle": {
				"text":"",
				"color":    "#666666",
				"fontSize": 10,
				"font":     "open sans"
			},
			"location": "top-left"
		},
		"size": {
			"canvasWidth": 400,
			"canvasHeight": 300,
			"pieInnerRadius": "50%",
			"pieOuterRadius": "75%"
		},
		"data": {
			"sortOrder": "value-desc",
			"smallSegmentGrouping": {
				"enabled": true,
				"label": sefa_config.translates.get_translate('others'),
			},
			"content": ''
		},
		"labels": {
			"outer": {
				"pieDistance": 32
			},
			"inner": {
				"hideWhenLessThanPercentage": 3
			},
			"mainLabel": {
				"fontSize": 9
			},
			"percentage": {
				"color": "#BDBDBD",
				"decimalPlaces": 0
			},
			"value": {
				"color": "#adadad",
				"fontSize": 10
			},
			"lines": {
				"enabled": true,
				"color": "#424242"
			},
			"truncation": {
				"enabled": true
			}
		},
		"tooltips": {
			"enabled": true,
			"type": "placeholder",
			"string": "{label}: {value}, {percentage}%"
		},
		"effects": {
			"pullOutSegmentOnClick": {
				"effect": "none",
				"speed": 400,
				"size": 8
			}
		},
		"misc": {
			"gradient": {
				"enabled": false,
				"percentage": 100
			}
		}
	};
};

//graph_species_tracked_by_protectionlevel
GRAPH_SEFA.prototype.graph_species_tracked_by_protectionlevel = function() {

	var div = 'sefa_graphs_species_tracked_by_protectionlevel';
	if(!$('#'+div).length){return;}
	
	//Data
	var data_total = manage_sd.get_groupby_protectionlevel_from_tesaurus();
	//Exclude EIL
	var data_tracked = manage_sd.get_groupby_species_by_protectionlevel();
	_.remove(data_tracked, ['label', 'EIL']);

	var abs_width = 400;
	var abs_height = 200;

    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 50},
	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(data_total, function(d) {return d.value;})]);

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.05,0)
			  .domain(_.map(data_total, function(n){return n.label;}));

	//Calculo l'alÁada de la barra del gr‡fic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Afegir barres amb el total
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', function(d,i){return d.color;})
		.style('fill-opacity', '0.7')
		.style('stroke', function(d,i){return d.color;})
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a mÌnim far‡ 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Total '+d.label+': '+d.value;})
		;		

	//Patro de ratlles
	svg.append('defs')
	  .append('pattern')
	    .attr('id', 'diagonalHatch')
	    .attr('patternUnits', 'userSpaceOnUse')
	    .attr('width', 4)
	    .attr('height', 4)
	  .append('path')
	    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
	    .attr('stroke', '#000000')
	    .attr('stroke-width', 1);

	//Afegir barres amb el parcial
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_tracked)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', 'url(#diagonalHatch)')
		.style('fill-opacity', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a mÌnim far‡ 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Amb seguiment '+d.label+': '+d.value;})
		;		

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	


	//Afegeixo text amb el % a les barres
	//Format amb el % i un  decimal
	var percent = d3.format('.1%');
	var minim_weight_bar = 30;
	var padding_label = 3;

	//var total_count = _.reduce(data_tracked, function(memo, d){ return memo + d.count; }, 0);

	svg.append('g')
		.attr('id','text_bars')
		.selectAll('text')
		.data(data_tracked)
		.enter()
		.append('text')
		//PosiciÛ del text
		.attr({'x':function(d){return scaleX(d.value)+(scaleX(d.value)<minim_weight_bar?padding_label:padding_label*-1);}, 'y':function(d){return scaleY(d.label)+(bar_height/2);}})
		//A dins o a fora de la barra
		.style('text-anchor', function(d){return scaleX(d.value)<minim_weight_bar?'start':'end';})
		.style('alignment-baseline', 'middle') 
		.style("font-size", "10px")
		.style("font-family", "sans-serif")
		// Make it a little transparent to tone down the black
		.style("opacity", 1)
		// Format the number, calculo el tant per cent sumant tots els valors presents a da
		.text(function(d){return percent((d.value/((_.find(data_total, function(x){return x.label == d.label})).value)));})
		;
		
		//Afegeixo el tÌtol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('number'));
		
	//Afegeixo el tÌtol del gr‡fic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left/2) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_species_tracked_by_protectionlevel_title'));		

}; //Fi de graph_species_tracked_by_protectionlevel()

//graph_species_tracked_by_protectionlevel
GRAPH_SEFA.prototype.graph_species_tracked_by_protectioncatalog = function() {

	var div = 'sefa_graphs_species_tracked_by_protectioncatalog';
	if(!$('#'+div).length){return;}
	
	//Data
	var data_total = manage_sd.get_groupby_protectioncatalog_from_tesaurus();
	_.remove(data_total, ['label', sefa_config.translates.get_translate('0')]);

	//Exclude EIL
	var data_tracked = manage_sd.get_groupby_species_by_protectioncatalog();
	_.remove(data_tracked, ['label', sefa_config.translates.get_translate('nopresent')]);

	var abs_width = 400;
	var abs_height = 200;

    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 60},
	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(data_total, function(d) {return d.value;})]);

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.05,0)
			  .domain(_.map(data_total, function(n){return n.label;}));

	//Calculo l'alÁada de la barra del gr‡fic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Afegir barres amb el total
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', function(d,i){return d.color;})
		.style('fill-opacity', '0.7')
		.style('stroke', function(d,i){return d.color;})
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a mÌnim far‡ 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Total '+d.label+': '+d.value;})
		;		

	//Patro de ratlles
	svg.append('defs')
	  .append('pattern')
	    .attr('id', 'diagonalHatch')
	    .attr('patternUnits', 'userSpaceOnUse')
	    .attr('width', 4)
	    .attr('height', 4)
	  .append('path')
	    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
	    .attr('stroke', '#000000')
	    .attr('stroke-width', 1)
	    .style("opacity", 0.8);

	//Afegir barres amb el parcial
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_tracked)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({'x':0,'y':function(d){return scaleY(d.label);}})
		.style('fill', 'url(#diagonalHatch)')
		.style('fill-opacity', '0.5')
		.attr('width',function(d){return scaleX(d.value)<2?2:scaleX(d.value);}) //Com a mÌnim far‡ 2px d'amplada
		.append("svg:title")
		.text(function(d) {return 'Amb seguiment '+d.label+': '+d.value;})
		;		

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	


	//Afegeixo text amb el % a les barres
	//Format amb el % i un  decimal
	var percent = d3.format('.1%');
	var minim_weight_bar = 31;
	var padding_label = 3;

	//var total_count = _.reduce(data_tracked, function(memo, d){ return memo + d.count; }, 0);

	svg.append('g')
		.attr('id','text_bars')
		.selectAll('text')
		.data(data_tracked)
		.enter()
		.append('text')
		//PosiciÛ del text
		.attr({'x':function(d){return scaleX(d.value)+(scaleX(d.value)<minim_weight_bar?padding_label:padding_label*-1);}, 'y':function(d){return scaleY(d.label)+(bar_height/2);}})
		//A dins o a fora de la barra
		.style('text-anchor', function(d){return scaleX(d.value)<minim_weight_bar?'start':'end';})
		.style('alignment-baseline', 'middle') 
		.style("font-size", "10px")
		.style("font-family", "sans-serif")
		// Make it a little transparent to tone down the black
		.style("opacity", 1)
		// Format the number, calculo el tant per cent sumant tots els valors presents a da
		.text(function(d){return percent((d.value/((_.find(data_total, function(x){return x.label == d.label})).value)));})
		;
		
		//Afegeixo el tÌtol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('number'));
		
	//Afegeixo el tÌtol del gr‡fic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left/2) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_species_tracked_by_protectioncatalog_title'));		

}; //Fi de graph_species_tracked_by_protectioncatalog()

//graph_species_tracked_by_tracked_dates_acumulated
GRAPH_SEFA.prototype.graph_species_tracked_by_tracked_dates_acumulated = function() {

	var div = 'sefa_graphs_species_tracked_by_tracked_dates_acumulated';
	if(!$('#'+div).length){return;}
	
	var min_bar_width = 5;
	
	//Data
	var data_total = manage_sd.get_groupby_species_by_tracked_dates_acumulated();
	var data_census = manage_sd.get_groupby_species_by_tracked_dates();
	
    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (data_total.length * 15) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Date
	var scaleX = d3.time.scale()
	          .range([0, width])
	          .domain([
	          			moment((_.minBy(data_total, function(x){return moment(x.t0, 'DD-MM-YYYY').valueOf();})).t0, 'DD-MM-YYYY').toDate(), 
	          			moment((_.maxBy(data_total, function(x){return moment(x.t1, 'DD-MM-YYYY').valueOf();})).t1, 'DD-MM-YYYY').toDate()
	          			])
	          .nice();

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.1,0)
			  .domain(_.map(data_total, function(n){return n.sp;}));

	//Calculo l'alÁada de la barra del gr‡fic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX
	
	//Afegir bbox de referËncia (invisible) amb title
/*
	svg.append('g')
		.attr('id','bbox_reference')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', 'transparent')
		.style('stroke', 'transparent')
		.attr('width',function(d){return scaleX(moment(d.t0,'DD-MM-YYYY').toDate());})
		.append("svg:title")
		.text(function(d) {return d.sp+': '+d.t0+' -> '+d.t1;})
		;		
*/

	//Afegir lÌnia de referËncia
	svg.append('g')
		.attr('id','line_reference')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('line')
		.attr('x1', 4)
		.attr('y1', function(d){return scaleY(d.sp)+(bar_height/2);})
		.attr('x2', function(d){return (scaleX(moment(d.t0,'DD-MM-YYYY').toDate()))-4;})
		.attr('y2', function(d){return scaleY(d.sp)+(bar_height/2);})
		//.style('stroke', '#31a354')
		.style('stroke', 'transparent')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '4')
		.on('mouseover', function(d,i){d3.select(this).transition().style('stroke', '#31a354');})
		.on('mouseout', function(d,i){d3.select(this).transition().style('stroke', 'transparent');})
		.append("svg:title")
		.text(function(d) {return d.sp+': '+d.t0+' -> '+d.t1;})
		;		

	//Afegir barres amb els totals
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(data_total)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':function(d){return scaleX(moment(d.t0,'DD-MM-YYYY').toDate());},
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', '#a1d99b')
		.style('fill-opacity', '0.7')
		.style('stroke', '#31a354')
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									var dif = scaleX(moment(d.t1,'DD-MM-YYYY').toDate()) - scaleX(moment(d.t0,'DD-MM-YYYY').toDate()); 
									return dif<min_bar_width?min_bar_width:dif;
								}) //Com a mÌnim far‡ min_bar_width d'amplada

		.append("svg:title")
		.text(function(d) {return d.sp+': '+d.t0+' -> '+d.t1;})
		;		


	//Patro de ratlles
	svg.append('defs')
	  .append('pattern')
	    .attr('id', 'diagonalHatch')
	    .attr('patternUnits', 'userSpaceOnUse')
	    .attr('width', 4)
	    .attr('height', 4)
	  .append('path')
	    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
	    .attr('stroke', '#000000')
	    .attr('stroke-width', 1)
	    .style("opacity", 0.8);

	//Afegir barres amb el parcial
/*
	svg.append('g')
		.attr('id','bars_pattern')
		.selectAll('rect')
		.data(data_census)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':function(d){
										//Si nomÈs tinc una data, miro si est‡ al final del perÌode
										var scaleX_min = scaleX(moment(d.DATA_CENS_FIRST,'DD-MM-YYYY').toDate());
										var scaleX_max = scaleX(moment(d.DATA_CENS_LAST,'DD-MM-YYYY').toDate());
										var dif = scaleX_max - scaleX_min;
										var data_max_limit = _.find(data_total, function(x){return x.sp == d.ESPECIE}).t1;
										var scaleX_max_limit = scaleX(moment(data_max_limit,'DD-MM-YYYY').toDate());
										var data_min_limit = _.find(data_total, function(x){return x.sp == d.ESPECIE}).t0;
										var scaleX_min_limit = scaleX(moment(data_min_limit,'DD-MM-YYYY').toDate());
										var dif_limit = scaleX_max_limit - scaleX_min_limit;
										
										if(dif < min_bar_width)
										{
											//Cas 1
											if(dif_limit < min_bar_width){return scaleX_min;}
											else if(scaleX_min + min_bar_width > scaleX_max_limit){return scaleX_min - (scaleX_min + min_bar_width - scaleX_max_limit);}
											else{return scaleX_min;}
										}
										else{return scaleX_min;}	
									},
					'y':function(d){return scaleY(d.ESPECIE);}
			  })		
	    .style('fill', 'url(#diagonalHatch)')
		.style('fill-opacity', '0.5')
		.attr('width',function(d){
									var dif = scaleX(moment(d.DATA_CENS_LAST,'DD-MM-YYYY').toDate()) - scaleX(moment(d.DATA_CENS_FIRST,'DD-MM-YYYY').toDate()); 
									return dif<min_bar_width?min_bar_width:dif;
								}) //Com a mÌnim far‡ min_bar_width d'amplada

		.append("svg:title")
		.text(function(d) {return d.ESPECIE+': '+d.DATA_CENS_FIRST+' -> '+d.DATA_CENS_LAST;})
		;		
*/

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	
	
	//Afegeixo el tÌtol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('date'));
		
	//Afegeixo el tÌtol del gr‡fic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_species_tracked_by_tracked_dates_acumulated_title'));		

}; //Fi de graph_species_tracked_by_tracked_dates_acumulated()

GRAPH_SEFA.prototype.graph_groupby_species_by_num_locations = function() {
	return this.graph_groupby_species_by_num_locations_(manage_sd.get_groupby_species_by_num_locations());
};

GRAPH_SEFA.prototype.graph_groupby_species_by_num_locations_by_park = function() {
	
	_.forEach(manage_sd.get_unique_protected_areas(),function(w){
		
		var div_origin = 'sefa_graphs_groupby_species_by_num_locations_by_park';
		if(!$('#'+div_origin).length){return;}

		var div = 'sefa_graphs_groupby_species_by_num_locations_by_park_'+w;
		$('#'+div_origin).append('<div class="row"><div class="panel panel-default"><div class="panel-heading">'+sefa_config.translates.get_translate(w)+'</div><div id="'+div+'" class="panel-body"></div></div></div>');
		graphs.graph_groupby_species_by_num_locations_(manage_sd.get_groupby_species_by_num_locations_by_park(w),div);
	});
};

GRAPH_SEFA.prototype.graph_groupby_species_by_num_locations_ = function(num_locations,div_) {

	var min_bar_width = 5;
	var div;
	if(!_.isUndefined(div_)){div = div_;}
	else{div = "sefa_graphs_groupby_species_by_num_locations";}
	if(!$('#'+div).length){return;}
		
	//Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (num_locations.length * 15) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: Linear
	//L'escala de les X s'ha de calcular sobre el total de totes les espËcies a tots els parcs!
	//No Ès molt Úptim, perÚ demano manage_sd.get_groupby_species_by_num_locations()
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(manage_sd.get_groupby_species_by_num_locations(), function(d) {return d.locations_total;})])
	          //.domain([0, d3.max(num_locations, function(d) {return d.locations_total;})])
	          .nice();

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.2,0)
			  .domain(_.map(num_locations, function(n){return n.sp;}));

	//Calculo l'alÁada de la barra del gr‡fic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
				//.ticks(scaleX.domain()[1]-scaleX.domain()[0])
	            .tickFormat(d3.format('d'));
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select("div#"+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Afegir barres amb els totals
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_locations)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', '#fed976')
		.style('fill-opacity', '0.7')
		.style('stroke', '#fed976')
		.style('stroke-opacity', '1')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									var x = scaleX(d.locations_total);
									return x<min_bar_width?min_bar_width:x;
								}) //Com a mÌnim far‡ min_bar_width d'amplada
		;		

	//Afegir barres amb el parcial
	svg.append('g')
		.attr('id','bars_pattern')
		.selectAll('rect')
		.data(num_locations)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })		
	    //.style('fill', 'url(#diagonalHatch)')
		.style('fill', '#e31a1c')
		.style('fill-opacity', '0.7')
		.attr('width',function(d){
									if(d.locations_census){
										var x = scaleX(d.locations_census);
										return x<min_bar_width?min_bar_width:x;
									}
								
								}) //Com a mÌnim far‡ min_bar_width d'amplada
		;		

	//Barres amb el total, transparents
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_locations)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', 'transparent')
		//.style('fill-opacity', '0.7')
		.style('stroke', 'transparent')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									var x = scaleX(d.locations_total);
									return x<min_bar_width?min_bar_width:x;
								}) //Com a mÌnim far‡ min_bar_width d'amplada
		.on('mouseover', function(d,i){d3.select(this).transition().style('stroke', '#000000');})   
		.on('mouseout', function(d,i){d3.select(this).transition().style('stroke', 'transparent');})		
		.append("svg:title")
		.text(function(d) {return d.sp+', '+sefa_config.translates.get_translate('locations')+': '+d.locations_total+', '+sefa_config.translates.get_translate('locations_with_census')+': '+d.locations_census;})
		;		

	//Afegeixo text amb el % a les barres
	//Format amb el % i un  decimal
	var percent = d3.format('.1%');
	var padding_label = 3;

	svg.append('g')
		.attr('id','text_bars')
		.selectAll('text')
		.data(num_locations)
		.enter()
		.append('text')
		//PosiciÛ del text
		.attr({
				'x':function(d){var x = scaleX(d.locations_census);
								return (x<min_bar_width?padding_label:x+padding_label);}, 
				'y':function(d){return scaleY(d.sp)+(bar_height/2);}
				})
		//A dins o a fora de la barra
		//.style('text-anchor', function(d){return scaleX(d.value)<min_bar_width?'start':'end';})
		.style('text-anchor', 'start')
		.style('alignment-baseline', 'middle') 
		.style("font-size", "9px")
		.style("font-family", "sans-serif")
		// Make it a little transparent to tone down the black
		.style("opacity", 1)
		// Format the number, calculo el tant per cent sumant tots els valors presents a da
		.text(function(d){
							var t = d.locations_census/d.locations_total;
							return _.floor(t)?'':percent(t);
					})
		;


	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);	
	
	//Afegeixo el tÌtol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('locations_number'));
		
	//Afegeixo el tÌtol del gr‡fic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_groupby_species_by_num_locations_title'));		

}; //Fi de graph_groupby_species_by_num_locations()


GRAPH_SEFA.prototype.graph_groupby_species_by_num_census = function() {

	var div = 'sefa_graphs_groupby_species_by_num_census';
	if(!$('#'+div).length){return;}
	var min_bar_width = 5;
	
	//Data
	var num_census = manage_sd.get_groupby_species_by_num_census();
	
    //Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (num_census.length * 15) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, d3.max(num_census, function(d) {return d.census_total;})])
	          .nice();

	//Escala Y: Ordinal
	var scaleY = d3.scale.ordinal()
	          .rangeBands([0, height],0.2,0)
			  .domain(_.map(num_census, function(n){return n.sp;}));

	//Calculo l'alÁada de la barra del gr‡fic, com una unitat de l'escala
	var bar_height = scaleY.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr("class", "img-responsive")
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Escala de colors
	var c = new GRAPHCOLOR(_.maxBy(num_census,'census_total').census_total, 'YlOrRd');

	//Afegir barres amb els totals
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_census)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
//		.style('fill', '#fed976')
		.style('fill', function(d){return c.get_colorRGB(d.census_total);})
		.style('fill-opacity', '0.9')
		.style('stroke', '#bdbdbd')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '1')
		.attr('width',function(d){
									if(d.census_total){
										var x = scaleX(d.census_total);
										return x<min_bar_width?min_bar_width:x;
									}
								}) //Com a mÌnim far‡ min_bar_width d'amplada
		;		

	//Barres amb el total, transparents
	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(num_census)
		.enter()
		.append('rect')
		.attr('height',bar_height)
		.attr({
					'x':0,
					'y':function(d){return scaleY(d.sp);}
			  })
		.style('fill', 'transparent')
		//.style('fill-opacity', '0.7')
		.style('stroke', 'transparent')
		.style('stroke-opacity', '0.5')
		.style('stroke-width', '0.5')
		.attr('width',function(d){
									if(d.census_total){
										var x = scaleX(d.census_total);
										return x<min_bar_width?min_bar_width:x;
									}
								}) //Com a mÌnim far‡ min_bar_width d'amplada
		.on('mouseover', function(d,i){d3.select(this).transition().style('stroke', '#000000');})   
		.on('mouseout', function(d,i){d3.select(this).transition().style('stroke', 'transparent');})		
		.append("svg:title")
		.text(function(d) {return d.sp+', '+sefa_config.translates.get_translate('n_census')+': '+d.census_total;})
		;		

	//Afegir eix X
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
		

	//Afegir eix Y				
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis)
		;	
	
	//Afegeixo el tÌtol de l'eix X
	svg.append('g')
		.attr('id','titol_x')
		.append("text")
		.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
		.attr("transform", "translate("+ (scaleX(scaleX.domain()[1])) +","+(height-(20/3))+")")  // centre below axis
		.style("font-size", "8px")
		.style("font-family", "sans-serif")
		.text(sefa_config.translates.get_translate('n_census'));
		
	//Afegeixo el tÌtol del gr‡fic
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+/*scaleY(0)*/-10+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_groupby_species_by_num_census_title'));		

}; //Fi de graph_groupby_species_by_num_census()

/* ***** */
GRAPH_SEFA.prototype.graph_protectedarea_species_locations = function() {

	var div = 'sefa_graphs_protectedarea_species_locations';
	if(!$('#'+div).length){return;}
	
	var min_bar_width = 5;
	var protectedarea_width = 10;
	var gap = 5;
	var sp_height = 11; //15
	
	//Data
	var w = manage_sd.get_protectedarea_species_locations();
	
	//w.species_list
	//w.psl --> protected areas
	//w.pasl --> All locations
	
	
    //Margins
	var margin = {top: 20, right: 25, bottom: 50, left: 200};

	//Calculate total height
	var abs_height = (w.species_list.length * sp_height) + margin.top + margin.bottom;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	//Escala X: linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain([0, 1]);

	//Escala Y: Ordinal
	var scaleY_sp = d3.scale.ordinal()
	          .rangeBands([0, height],0.2,0)
			  .domain(_.map(w.species_list, function(n){return n.ESPECIE;}));

	var scaleY_pa = d3.scale.linear()
	          .range([0, height])
	          //.domain([0, d3.max(w.psl, function(d) {return d.locations_accumulated;})])
			  .domain([0, (d3.max(w.psl, function(d) {return d.locations_accumulated;}))+(_.last(w.psl)).locations_total])
			  ;	



	//Calculo l'alÁada de la barra del gr‡fic, com una unitat de l'escala
	var bar_height_sp = scaleY_sp.rangeBand();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY_sp)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//DIBUIX

	//Escala de colors
	var c = new GRAPHCOLOR(w.psl.length, 'Spectral');

	//*******************************
	//Barres dels parcs naturals
	//*******************************
	svg.append('g')
		.attr('id','bars_pa')
		.selectAll('rect')
		.data(w.psl)
		.enter()
		.append('rect')
		.attr('height',function(d){return scaleY_pa(d.locations_total)})
		.attr({
					'x':scaleX(1)-protectedarea_width,
					'y':function(d){return scaleY_pa(d.locations_accumulated);}
			  })
		.style('fill', function(d,i){return c.get_colorRGB(i);})
		.style('fill-opacity', '0.9')
		.style('stroke', 'black')
		.style('stroke-opacity', '0.9')
		.style('stroke-width', '1')
		.attr('width',protectedarea_width) //Com a mÌnim far‡ min_bar_width d'amplada

		.on('mouseover', function(d,i){
										//PARCS
										//Esborrar les barres de tots els parcs
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.select(this).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										
										//FLUXES
										//Esborrar tots els fluxes
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//Il∑luminar nomÈs els fluxes d'aquest parc natural
										d3.selectAll('#fluxes path').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);

										//Etiquetes espËcies
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0.9);
										_.forEach(d.species, function(o){
												d3.selectAll('#bars_species rect').filter(function(r){return r.ESPECIE == o.specie;}).transition().style('fill-opacity', 0);
											});

										//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 1);
									  })
									  
		.on('mouseout', function(d,i){
										//PARCS
										//Tornar a l'estat inicial
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);

									 })
		;		

	//Etiquetes dels Parcs
	svg.append('g')
		.attr('id','protectedareas_labels')
		.selectAll('text')
		.data(w.psl)
		.enter()
		.append('text')
		.attr({
					'x':scaleX(1)+gap,
					'y':function(d){return (scaleY_pa(d.locations_accumulated)+(scaleY_pa(d.locations_total)/2));}
			  })
		.text( function (d) { return d.protectedarea; })
		.style('font-family', 'sans-serif')
		.style('font-size', '8px')
		.style('fill', 'black')
		.style('fill-opacity', '1')
		;	

	//Rectangles sobre les etiquetes dels parcs
	svg.append('g')
		.attr('id','bars_pa_labels')
		.selectAll('rect')
		.data(w.psl)
		.enter()
		.append('rect')
		.attr('height',function(d){return scaleY_pa(d.locations_total)})
		.attr({
					'x':scaleX(1),
					'y':function(d){return scaleY_pa(d.locations_accumulated);}
			  })
		.style('fill', 'white')
		.style('fill-opacity', '0')
		.style('stroke', 'none')
		//.style('stroke-opacity', '0')
		//.style('stroke-width', '1')
		.attr('width',margin.right)

		.on('mouseover', function(d,i){
										//PARCS
										//Esborrar les barres de tots els parcs
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//d3.select(this).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_pa rect').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);										
										//FLUXES
										//Esborrar tots els fluxes
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//Il∑luminar nomÈs els fluxes d'aquest parc natural
										d3.selectAll('#fluxes path').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);

										//Etiquetes espËcies
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0.9);
										_.forEach(d.species, function(o){
												d3.selectAll('#bars_species rect').filter(function(r){return r.ESPECIE == o.specie;}).transition().style('fill-opacity', 0);
											});

										//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 1);
									  })
									  
		.on('mouseout', function(d,i){
										//PARCS
										//Tornar a l'estat inicial
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);

									 })
		;		
	

	//Afegir eix Y - EspËcies
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis)
/*
		.selectAll('text')
		.style('font-family', 'sans-serif')
		.style('font-size', '9px')
		.style('fill', 'black')
		.style('fill-opacity', '1')
*/
		;	


	//* **********************
	// Rectangles sobre les etiquetes de les espÈcies
	//* **********************
	svg.append('g')
		.attr('id','bars_species')
		.selectAll('rect')
		.data(w.species_list)
		.enter()
		.append('rect')
		.attr('height',bar_height_sp+2) //2px de marge per tapar tota la label.
		.attr({
					'x':scaleX(0)-margin.left,
					'y':function(d){return scaleY_sp(d.ESPECIE);}
			  })
		.style('fill', 'white')
		.style('fill-opacity', 0)
		.style('stroke', 'none')
		//.style('stroke-opacity', '0.9')
		//.style('stroke-width', '1')
		.attr('width',margin.left-gap)

		.on('mouseover', function(d,i){
										//FLUXES
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										//Il∑luminar nomÈs els fluxes d'aquesta espËcie
										d3.selectAll('#fluxes path').filter(function(r){return r.specie == d.ESPECIE;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);

										//ETIQUETES
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0.9);
										d3.select(this).transition().style('fill-opacity', 0);
										
										//PARCS
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.selectAll('#bars_pa rect').filter(function(r){
															var q = _.find(r.species, function(i){return i.specie == d.ESPECIE});
															return _.isUndefined(q)?false:true;
													}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
									  
									  	//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){
															var q = _.find(r.species, function(i){return i.specie == d.ESPECIE});
															return _.isUndefined(q)?false:true;
													}).transition().style('fill-opacity', 1);										
									  })
									  
		.on('mouseout', function(d,i){
										//Tornar a l'estat inicial
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);
									 })
		;

	//********************
	//Path de fluxes
	//********************
	var poly = function(d){
		var xy0 = {'x':(scaleX(1)-protectedarea_width-gap), 'y':(scaleY_pa(d.s_locations_accumulated))};
		var xy1 = {'x':(scaleX(0)+gap), 'y':(scaleY_sp(d.specie))};
		var xy2 = {'x':(scaleX(0)+gap) ,'y':(scaleY_sp(d.specie)+(bar_height_sp))};
		var xy3 = {'x':(scaleX(1)-protectedarea_width-gap) ,'y':(scaleY_pa(d.s_locations_accumulated+d.s_locations_total))};
	
		var i = 'M '+xy0.x+' '+xy0.y+' ';
		var f= 'Z';
		var s0 = 'L '+xy2.x+' '+xy2.y+' ';
	
	//	var randomX = _.random(0.2, 0.8, true);
		var randomX = 0.3;
	
		//https://www.dashingd3js.com/svg-paths-and-d3js
		var curve_d1 = function(x1,y1){
			
			var xp = scaleX(randomX);
			var yp = y1;
			
			return 'Q '+xp+' '+yp+' '+x1+' '+y1+' ';
		};
	
		var curve_d2 = function(x0,y0,x1,y1){
			
			var xp = scaleX(randomX);
			var yp = y0;
			
			return 'Q '+xp+' '+yp+' '+x1+' '+y1+' ';
		};
		var d1 = curve_d1(xy1.x,xy1.y);
		var d2 = curve_d2(xy2.x,xy2.y,xy3.x,xy3.y);
		return i+d1+s0+d2+f;
	};
	svg.append('g')
		.attr('id','fluxes')
		.selectAll('rect')
		.data(w.pasl)
		.enter()
		.append('path')
		.attr('d', function(d){return poly(d);})
		.style('stroke', '#bdbdbd')
		.style('stroke-opacity', 0.9)
		.style('stroke-width', 0.5)
		.style('fill',function(d){return c.get_colorRGB(_.findIndex(w.psl, function(o){return d.protectedarea == o.protectedarea;}));})
		.style('fill-opacity', 0.5)

		.on('mouseover', function(d,i){
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.select(this).transition().style('fill-opacity', 0.9);
										
										//ETIQUETES
										d3.selectAll('#bars_species rect').filter(function(r){return !(r.ESPECIE == d.specie);}).transition().style('fill-opacity', 0.9);

										//PARCS
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.1).style('stroke-opacity', 0.2);
										d3.selectAll('#bars_pa rect').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.2);

										//Protected Areas Labels
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 0.4);
										d3.selectAll('#protectedareas_labels text').filter(function(r){return r.protectedarea == d.protectedarea;}).transition().style('fill-opacity', 1);
									  })
									  
		.on('mouseout', function(d,i){
										d3.selectAll('#fluxes path').transition().style('fill-opacity', 0.5).style('stroke-opacity', 0.9);
										d3.selectAll('#bars_species rect').transition().style('fill-opacity', 0);
										d3.selectAll('#bars_pa rect').transition().style('fill-opacity', 0.9).style('stroke-opacity', 0.9);
										d3.selectAll('#protectedareas_labels text').transition().style('fill-opacity', 1);
									 })
		;		

	//Afegeixo el tÌtol del gr‡fic

	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(sefa_config.translates.get_translate('graph_locations_species_protectedarea'));		

}; //Fi de graph_protectedarea_species_locations()



// THREATS
GRAPH_SEFA.prototype.graph_by_threats = function(){
	
	var div = 'sefa_graphs_threats';
	if(!$('#'+div).length){return;}
	var width = 500;
	var height = 300;
	var d = manage_sd.get_groupby_threats();
	var n_total = ' ('+sefa_config.translates.get_translate('n_total')+_.sumBy(d, function(o) {return o.value;})+')';
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('threats'))+n_total;
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	defaults.size.pieInnerRadius='25%';
	defaults.size.canvasWidth = width;
	defaults.size.canvasHeight = height;	
	
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+width+'px;'+'height:'+height+'px;');
	return pie;
};


// IMPACTS
GRAPH_SEFA.prototype.graph_by_impacts = function(){
	
	var div = 'sefa_graphs_impacts';
	if(!$('#'+div).length){return;}
	var width = 500;
	var height = 300;
	var d = manage_sd.get_groupby_impacts();
	var n_total = ' ('+sefa_config.translates.get_translate('n_total')+_.sumBy(d, function(o) {return o.value;})+')';
	var defaults = pie_defaults();
	defaults.header.title.text = _.capitalize(sefa_config.translates.get_translate('impacts'))+n_total;
	defaults.data.content = d;
	defaults.data.smallSegmentGrouping.enabled = false;
	defaults.size.pieInnerRadius='25%';
	defaults.size.canvasWidth = width;
	defaults.size.canvasHeight = height;	
	
	var pie = new d3pie(div, defaults);
	$('div#'+div+' svg')
	.attr('class', 'img-responsive')
	.attr('style', 'width:'+width+'px;'+'height:'+height+'px;');
	return pie;
};

GRAPH_SEFA.prototype.graph_by_impacts_year_series = function(){
	
	var div = 'sefa_graphs_impacts_year_series';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_impacts_peryear();

	/* ************************************************************** */
    //Legend width
    var legend_width = 150;
    
    //Margins
	var margin = {top: 20, right: legend_width, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;
	
	//padding a l'eix de les X
	var padding=10;

	//Llegenda
	legend_line_length = legend_width*0.50;
	legend_line_v_gap = 25;
	legend_line_h_gap = 10;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain(d.ry);

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_impacts_year_series')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Dibuixar les lÌnies de les sËries
	var line = d3.svg.line()
    .x(function(u) { return scaleX(u.DATA); })
    .y(function(u) { return scaleY(u.VALOR); })
    ;

	//Escala de colors
	var c = new GRAPHCOLOR(_.keys(d.d).length, 'Spectral');
	
	var lines_transitions = {stroke_width_normal:2,
					  		stroke_width_selected:4,
					  		stroke_width_notselected:0.5,
					  		stroke_opacity_normal:0.8,
					  		stroke_opacity_selected:0.9,
					  		stroke_opacity_notselected:0.1
					  		};

	var circles_transitions = {					  			
						  		stroke_opacity_normal:0.8,
						  		stroke_opacity_selected:1,
						  		stroke_opacity_notselected:0.3,
						  		
						  		fill_opacity_normal:0.5,
						  		fill_opacity_selected:0.9,
						  		fill_opacity_notselected:0.1,
					  			
					  			radius_normal: '3px',
					  			radius_selected: '5px',
					  			radius_notselected: '1px'
					  			
					  		};

	//Escala Y per la llegenda: linear
	var scaleY_legend = d3.scale.linear()
	          .range([0, legend_line_v_gap*(_.keys(d.d)).length])
	          .domain([0,(_.keys(d.d)).length]);

	_.forOwn(d.d,function(value, key) 
	{
		//index del key a l'array
		var ii = _.indexOf(_.keys(d.d),key);
		var color = c.get_colorRGB(ii);
		var text_label = sefa_config.translates.get_translate(key);
		
		//Dibuixo la lÌnia
		svg.append('path')
			.attr('id','linies_impacts'+ii)
			.attr('d', line(value))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)

			.on('mouseover', function(d,i){
											//LINIES, Esborrar totes les altres lÌnies i seleccionada l'escollida
											//Seleccions especials amb selectAll: http://codepen.io/AlexBezuska/pen/EtDJe
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select(this).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
										  
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_impact'+ii).transition().style('fill-opacity',0);

										  	//CERCLES
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_impacts'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0);

										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
			.append("svg:title")
			.text(text_label)
			;
			//MÈs styles a: http://www.d3noob.org/2014/02/styles-in-d3js.html

		//Dibuixo un punt a cada vËrtex de la lÌnia
		_.forEach(value, function(w){
			svg.append('circle')
				.attr('id','punts_impacts'+ii)
				.attr('cx', scaleX(w.DATA))           // position the x-centre
				.attr('cy', scaleY(w.VALOR))           // position the y-centre
				.attr('r', circles_transitions.radius_normal)             // set the radius
				.style('fill', color)     // set the fill colour*/
				.style('fill-opacity',circles_transitions.fill_opacity_normal)
				.style('stroke', color)
				.style('stroke-width', '0.5px')
				.style('stroke-opacity',circles_transitions.stroke_opacity_normal)
				.on('mouseover', function(d,i){
												//LINIES, Esborrar totes les altres lÌnies i seleccionada l'escollida
												d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
												d3.select('path#linies_impacts'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
												                            .style('stroke-width', lines_transitions.stroke_width_selected);
												//BBOX
												d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0.9);
												d3.select('#legend_box_impact'+ii).transition().style('fill-opacity',0);
											  
											  	//CERCLES
												d3.selectAll('[id*="punts_impacts"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_notselected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
													.attr('r', circles_transitions.radius_notselected);
	
												d3.selectAll('circle#punts_impacts'+ii).transition()
													.style('fill-opacity', circles_transitions.fill_opacity_selected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
													.attr('r', circles_transitions.radius_selected);
											  })
											  
				.on('mouseout', function(d,i){
												//LINIES, Tornar a l'estat inicial
												d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);

												//BBOX
												d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0);
											 
											 	//CERCLES, Tornar a l'estat inicial
												d3.selectAll('[id*="punts_impacts"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_normal)
													.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
													.attr('r', circles_transitions.radius_normal);
											 })

				.append("svg:title")
				.text(function(d) {return sefa_config.translates.get_translate('n_total')+w.VALOR;})
				;
		});

		//Llegenda
		svg.append('line')
			.attr('id','legend_line_impact'+ii)
			.attr('x1', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y1', scaleY_legend(ii))
			.attr('x2', scaleX(d.rx[1])+legend_line_h_gap+legend_line_length)
			.attr('y2', scaleY_legend(ii))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			;
			
		svg.append('text')
			.attr('id','legend_text_impact'+ii)
			.style('text-anchor', 'start')
			.style('alignment-baseline', 'middle') 
			.style('font-size', '8px')
			.style('font-family', 'sans-serif')
			.text(text_label)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii)+lines_transitions.stroke_width_normal*4)
			;		

		svg.append('rect')
			.attr('id','legend_box_impact'+ii)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii))
			.attr('width', legend_width-legend_line_h_gap)
			.attr('height', legend_line_v_gap)
			.style('fill', 'white')
			.style('fill-opacity', '0')
			.style('stroke', 'none')
			.on('mouseover', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_impact'+ii).transition().style('fill-opacity',0);

											//LINIES, Esborrar totes les altres lÌnies i seleccionada l'escollida
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select('path#linies_impacts'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
										  
										  	//CERCLES
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_impacts'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_impact"]').transition().style('fill-opacity', 0);

											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_impacts"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_impacts"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
			;
	});

	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('impacts_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;

};

GRAPH_SEFA.prototype.graph_by_impacts_year_totals = function(){
	
	var div = 'sefa_graphs_impacts_year_totals';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_impacts_peryear();

	/* ************************************************************** */
    //Margins
	var margin = {top: 20, right: 25, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	var padding = 25;
	var width_bar = 50;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width-padding])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain([0,d.ry_d[1]])
	          .nice();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_impacts_year_totals')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Escala de colors
	var c = new GRAPHCOLOR(d.d_peryear.length, 'Spectral');

	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(d.d_peryear)
		.enter()
		.append('rect')
		.attr('height',function(h){return height-scaleY(h.val);})
		.attr('width',width_bar)
		.attr({'x':function(w){return scaleX(w.date)-(width_bar/2)},'y':function(r){return scaleY(r.val);}})
		.style('fill', function(d,i){return c.get_colorRGB(i);})
		.style('fill-opacity', '0.5')
		.style('stroke', function(d,i){return c.get_colorRGB(i);})
		.style('stroke-opacity', '1')
		.style('stroke-width', '1')
		.append("svg:title")
		.text(function(d) {return d.date+'\n'+sefa_config.translates.get_translate('n_total')+d.val;})
		;		
		
	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('impacts_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)-padding) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;
};

GRAPH_SEFA.prototype.graph_by_impacts_histo = function(){

	$('#sefa_graphs_impacts_year_totals').toggle();

	this.graph_by_impacts_year_series();
	this.graph_by_impacts_year_totals();
	
	//BotÛ per mostrar els totals per cada any (es modifica l'escala y i es dibuixa un histograma
	$('#sefa_graphs_impacts_year_series_button_totals').append('<div class="checkbox"><label><input id="check_graphs_impacts_year_series_button_totals" type="checkbox" value="">'+sefa_config.translates.get_translate('total_for_year')+'</label></div>');
	$('#check_graphs_impacts_year_series_button_totals').change(function() {
		
		if(this.checked) {
        	
        	$('#sefa_graphs_impacts_year_series').toggle('slow');
        	$('#sefa_graphs_impacts_year_totals').toggle('slow');
	   	}
    	else{
        	$('#sefa_graphs_impacts_year_series').toggle('slow');
        	$('#sefa_graphs_impacts_year_totals').toggle('slow');
    	}
	});	
};

GRAPH_SEFA.prototype.graph_by_threats_year_series = function(){
	
	var div = 'sefa_graphs_threats_year_series';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_threats_peryear();

	/* ************************************************************** */
 	//Legend width
    var legend_width = 150;
    
    //Margins
	var margin = {top: 20, right: legend_width, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;
	
	//padding a l'eix de les X
	var padding=10;

	//Llegenda
	legend_line_length = legend_width*0.50;
	legend_line_v_gap = 25;
	legend_line_h_gap = 10;

	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain(d.ry);

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_threats_year_series')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Dibuixar les lÌnies de les sËries
	var line = d3.svg.line()
    .x(function(u) { return scaleX(u.DATA); })
    .y(function(u) { return scaleY(u.VALOR); })
    ;

	//Escala de colors
	var c = new GRAPHCOLOR(_.keys(d.d).length, 'Spectral');
	
	var lines_transitions = {stroke_width_normal:2,
					  		stroke_width_selected:4,
					  		stroke_width_notselected:0.5,
					  		stroke_opacity_normal:0.8,
					  		stroke_opacity_selected:0.9,
					  		stroke_opacity_notselected:0.1
					  		};

	var circles_transitions = {					  			
						  		stroke_opacity_normal:0.8,
						  		stroke_opacity_selected:1,
						  		stroke_opacity_notselected:0.3,
						  		
						  		fill_opacity_normal:0.5,
						  		fill_opacity_selected:0.9,
						  		fill_opacity_notselected:0.1,
					  			
					  			radius_normal: '3px',
					  			radius_selected: '5px',
					  			radius_notselected: '1px'
					  			
					  		};

	//Escala Y per la llegenda: linear
	var scaleY_legend = d3.scale.linear()
	          .range([0, legend_line_v_gap*(_.keys(d.d)).length])
	          .domain([0,(_.keys(d.d)).length]);
	
	_.forOwn(d.d,function(value, key) 
	{
		//index del key a l'array
		var ii = _.indexOf(_.keys(d.d),key);
		var color = c.get_colorRGB(ii);
		var text_label = sefa_config.translates.get_translate(key);
		
		//Dibuixo la lÌnia
		svg.append('path')
			.attr('id','linies_threats'+ii)
			.attr('d', line(value))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)
			//.style("stroke-linecap", "round")
			//.style("stroke-dasharray", ("10,3"))
			//.style("fill-opacity", .2
			//.style("stroke-opacity", .2)

			.on('mouseover', function(d,i){
											//LINIES, Esborrar totes les altres lÌnies i seleccionada l'escollida
											//Seleccions especials amb selectAll: http://codepen.io/AlexBezuska/pen/EtDJe
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select(this).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_threats'+ii).transition().style('fill-opacity',0);

										  	//CERCLES
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_threats'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0);

										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
			.append("svg:title")
			.text(text_label)
			;
			//MÈs styles a: http://www.d3noob.org/2014/02/styles-in-d3js.html

		//Dibuixo un punt a cada vËrtex de la lÌnia
		_.forEach(value, function(w){
			svg.append('circle')
				.attr('id','punts_threats'+ii)
				.attr('cx', scaleX(w.DATA))           // position the x-centre
				.attr('cy', scaleY(w.VALOR))           // position the y-centre
				.attr('r', circles_transitions.radius_normal)             // set the radius
				.style('fill', color)     // set the fill colour*/
				.style('fill-opacity',circles_transitions.fill_opacity_normal)
				.style('stroke', color)
				.style('stroke-width', '0.5px')
				.style('stroke-opacity',circles_transitions.stroke_opacity_normal)
				.on('mouseover', function(d,i){
												//LINIES, Esborrar totes les altres lÌnies i seleccionada l'escollida
												d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
												d3.select('path#linies_threats'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
												                            .style('stroke-width', lines_transitions.stroke_width_selected);
												//BBOX
												d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0.9);
												d3.select('#legend_box_threats'+ii).transition().style('fill-opacity',0);

											  	//CERCLES
												d3.selectAll('[id*="punts_threats"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_notselected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
													.attr('r', circles_transitions.radius_notselected);
	
												d3.selectAll('circle#punts_threats'+ii).transition()
													.style('fill-opacity', circles_transitions.fill_opacity_selected)
													.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
													.attr('r', circles_transitions.radius_selected);
											  })
											  
				.on('mouseout', function(d,i){
												//LINIES, Tornar a l'estat inicial
												d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
											 
												//BBOX
												d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0);

											 	//CERCLES, Tornar a l'estat inicial
												d3.selectAll('[id*="punts_threats"]').transition()
													.style('fill-opacity', circles_transitions.fill_opacity_normal)
													.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
													.attr('r', circles_transitions.radius_normal);
											 })

				.append("svg:title")
				.text(function(d) {return sefa_config.translates.get_translate('n_total')+w.VALOR;})
				;
			});
		//Llegenda
		svg.append('line')
			.attr('id','legend_line_threats'+ii)
			.attr('x1', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y1', scaleY_legend(ii))
			.attr('x2', scaleX(d.rx[1])+legend_line_h_gap+legend_line_length)
			.attr('y2', scaleY_legend(ii))
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-opacity', lines_transitions.stroke_opacity_normal)
			.style('stroke-width', lines_transitions.stroke_width_normal)
			;
			
		svg.append('text')
			.attr('id','legend_text_threats'+ii)
			.style('text-anchor', 'start')
			.style('alignment-baseline', 'middle') 
			.style('font-size', '8px')
			.style('font-family', 'sans-serif')
			.text(text_label)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii)+lines_transitions.stroke_width_normal*4)
			;		

		svg.append('rect')
			.attr('id','legend_box_threats'+ii)
			.attr('x', scaleX(d.rx[1])+legend_line_h_gap)
			.attr('y', scaleY_legend(ii))
			.attr('width', legend_width-legend_line_h_gap)
			.attr('height', legend_line_v_gap)
			.style('fill', 'white')
			.style('fill-opacity', '0')
			.style('stroke', 'none')
			.on('mouseover', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0.9);
											d3.select('#legend_box_threats'+ii).transition().style('fill-opacity',0);

											//LINIES, Esborrar totes les altres lÌnies i seleccionada l'escollida
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_notselected);
											d3.select('path#linies_threats'+ii).transition().style('stroke-opacity',lines_transitions.stroke_opacity_selected)
											                            .style('stroke-width', lines_transitions.stroke_width_selected);
										  
										  	//CERCLES
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_notselected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_notselected)
												.attr('r', circles_transitions.radius_notselected);

											d3.selectAll('circle#punts_threats'+ii).transition()
												.style('fill-opacity', circles_transitions.fill_opacity_selected)
												.style('stroke-opacity', circles_transitions.stroke_opacity_selected)
												.attr('r', circles_transitions.radius_selected);
										  })
										  
			.on('mouseout', function(d,i){
											//BBOX
											d3.selectAll('[id*="legend_box_threats"]').transition().style('fill-opacity', 0);

											//LINIES, Tornar a l'estat inicial
											d3.selectAll('[id*="linies_threats"]').transition().style('stroke-opacity', lines_transitions.stroke_opacity_normal).style('stroke-width', lines_transitions.stroke_width_normal);
										 
										 	//CERCLES, Tornar a l'estat inicial
											d3.selectAll('[id*="punts_threats"]').transition()
												.style('fill-opacity', circles_transitions.fill_opacity_normal)
												.style('stroke-opacity', circles_transitions.stroke_opacity_normal)
												.attr('r', circles_transitions.radius_normal);
										 })
	});

	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('threats_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;

};

GRAPH_SEFA.prototype.graph_by_threats_year_totals = function(){
	
	var div = 'sefa_graphs_threats_year_totals';
	if(!$('#'+div).length){return;}
	var d = manage_sd.get_threats_peryear();

	/* ************************************************************** */
    //Margins
	var margin = {top: 20, right: 25, bottom: 50, left: 50};

	//Absolute
	var abs_height = 500;
	var abs_width = 700;

	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;

	var padding = 15;
	var width_bar = padding*2;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          //.range([0, width])
	          .range([padding, width-padding])
	          .domain(d.rx)
	          ;

	//Escala Y: linear
	var scaleY = d3.scale.linear()
	          .range([height, 0])
	          .domain([0,d.ry_d[1]])
	          .nice();

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            .outerTickSize(0)
	            ;

	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id','sefa_graphs_threats_year_totals')
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Escala de colors
	var c = new GRAPHCOLOR(d.d_peryear.length, 'Spectral');

	svg.append('g')
		.attr('id','bars')
		.selectAll('rect')
		.data(d.d_peryear)
		.enter()
		.append('rect')
		.attr('height',function(h){return height-scaleY(h.val);})
		.attr('width',width_bar)
		.attr({'x':function(w){return scaleX(w.date)-(width_bar/2)},'y':function(r){return scaleY(r.val);}})
		.style('fill', function(d,i){return c.get_colorRGB(i);})
		.style('fill-opacity', '0.5')
		.style('stroke', function(d,i){return c.get_colorRGB(i);})
		.style('stroke-opacity', '1')
		.style('stroke-width', '1')
		.append("svg:title")
		.text(function(d) {return d.date+'\n'+sefa_config.translates.get_translate('n_total')+d.val;})
		;		
		
	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	//Titol
	svg.append('g')
		.attr('id','titol_g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+(margin.top/2)*-1+")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('threats_evolution')));

	//Unitats X
	svg.append('g')
		.attr('id','titol_eix_x')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[1]))/2) +","+   (scaleY(scaleY.domain()[0])+(margin.bottom*0.75)) +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('year')));

	//Unitats Y
	svg.append('g')
		.attr('id','titol_eix_y')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-(margin.left*0.75)-padding) +","+   (scaleY(scaleY.domain()[0]))/2  +")rotate(-90)")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text((sefa_config.translates.get_translate('number')));

	return svg;
};

GRAPH_SEFA.prototype.graph_by_threats_histo = function(){

	$('#sefa_graphs_threats_year_totals').toggle();

	this.graph_by_threats_year_series();
	this.graph_by_threats_year_totals();
	
	//BotÛ per mostrar els totals per cada any (es modifica l'escala y i es dibuixa un histograma
	$('#sefa_graphs_threats_year_series_button_totals').append('<div class="checkbox"><label><input id="check_graphs_threats_year_series_button_totals" type="checkbox" value="">'+sefa_config.translates.get_translate('total_for_year')+'</label></div>');
	$('#check_graphs_threats_year_series_button_totals').change(function() {
		
		if(this.checked) {
        	
        	$('#sefa_graphs_threats_year_series').toggle('slow');
        	$('#sefa_graphs_threats_year_totals').toggle('slow');
	   	}
    	else{
        	$('#sefa_graphs_threats_year_series').toggle('slow');
        	$('#sefa_graphs_threats_year_totals').toggle('slow');
    	}
	});	
};

GRAPH_SEFA.prototype.graph_by_population_trend_by_park = function(id_park,species_trend,defaults){
	
	var factor_escala_1 = defaults.factor_escala_1;
	var factor_escala_2 = defaults.factor_escala_2;

    //Margins
	var margin = defaults.margin;
	//Absolute
	var abs_height = defaults.abs_height;
	var abs_width = defaults.abs_width;
	var width = defaults.width;
	var height = defaults.height;

	var scaleX = defaults.scaleX;

	var s_park = id_park;
	var s_div = 'sefa_graphs_population_trend_'+s_park;

	var v = species_trend;

	//Bucle per a totes les espËcies dins del parc
	_.forEach(_.uniqBy(v, function(w){return w.SP;}), function(vv){
	
		var s_sp = vv.SP;
		s_div_sp = s_div+'_'+s_sp;
		$('#'+s_div).append('<div id="'+s_div_sp+'" class="col-md-6"></div>');
			
		//De totes les dades, seleccionar per park i espËcie
		var r = _.filter(v, function(w){return _.isEqual(w.SP, vv.SP)});

		//Gr‡fic d'una espËcie
		//Escala Y: linear, prÚpia per a cada gr‡fica
		var scaleY = d3.scale.linear()
			.range([height, 0])
			.domain([0,_.maxBy(r,function(w){return w.VAL;}).VAL*factor_escala_1])
			.nice()
			;
		
		//Si nomÈs tinc una data per espËcie, ajusto l'eix de les Y
		if(r.length<2)
		{
			scaleY.domain([0,(_.maxBy(r,function(w){return w.VAL;}).VAL)*factor_escala_2]);
		}

		//Eix X
		var xAxis = d3.svg.axis()
		            .scale(scaleX)
		            .orient("bottom")
		            .tickFormat(d3.format('d'))
		            //.tickPadding(10)
		            ;
		//Eix Y
		var yAxis = d3.svg.axis()
		            .scale(scaleY)
		            .orient("left")
		            //.innerTickSize(0)
		            //.outerTickSize(0)
		            .ticks(4)
		            .tickFormat(d3.format('d'))
		            ;
		//Objecte grafic
		var svg = d3.select('div#'+s_div_sp).append("svg")
			.attr('id',s_div+'_'+s_sp)
		    .style('width', width + margin.left + margin.right+'px')
		    .style('height', height + margin.top + margin.bottom+'px')
		    .attr('class', 'img-responsive')
			.append('g')
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//ClipPath per evitar que les lÌnies de regressiÛ surtin del CANVAS
		svg.append('clipPath')
			.attr('id', 'rect-clip')
			.append('rect')
				.attr('x', scaleX(scaleX.domain()[0]))
				.attr('y', scaleY(scaleY.domain()[1]))
				.attr('width', scaleX(scaleX.domain()[1])-scaleX(scaleX.domain()[0]))
				.attr('height', scaleY(scaleY.domain()[0])-scaleY(scaleY.domain()[1]))
				.style('stroke', 'red')
				.style('fill', 'black')
			;

		//Dibuixar les lÌnies de les sËries
		var line = d3.svg.line()
		    .x(function(u){return scaleX(u.DATE);})
		    .y(function(u){return scaleY(u.VAL);})
	    ;

		//Si tenim mÈs dues dates, dibuixo una lÌnia
		if(r.length>1){
			//Dibuixo la lÌnia
			svg.append('path')
				.attr('d', line(r))
				.style('fill', 'none')
				.style('stroke', 'black')
				.style('stroke-width', 1)
				.style('stroke-opacity', 1)
				;
		}

		//VËrtexs de les lÌnies
		_.forEach(r, function(w){
			svg.append('circle')
				.attr('cx', scaleX(w.DATE))
				.attr('cy', scaleY(w.VAL))
				.attr('r', 3)
				.style('fill', 'black')
				.style('fill-opacity',1)
				.append('svg:title')
				.text(sefa_config.translates.get_translate('n_total')+w.VAL+' ('+w.DATE+')')
				;
		});
		
		//Afegir la lÌnia de regressiÛ, nomÈs si tenim mÈs de 2 punts
		if(r.length>2){
			var lrxy = [];
			_.forEach(_.orderBy(r, function(w){return w.DATE}), function(z){
					lrxy.push([z.DATE,z.VAL]);
				});
			var lr = regression('linear', lrxy);

			"y = lr.equation[0]*x + lr.equation[1]"
			svg.append('line')
				//.attr('id','legend_line_threats'+ii)
				.attr('x1', scaleX(scaleX.domain()[0]))
				.attr('y1', scaleY(lr.equation[0]*scaleX.domain()[0] + lr.equation[1]))
				.attr('x2', scaleX(scaleX.domain()[1]))
				.attr('y2', scaleY(lr.equation[0]*scaleX.domain()[1] + lr.equation[1]))
				//Faig un clipping perquË no surti la lÌnia del CANVAS
				//http://www.d3noob.org/2015/07/clipped-paths-in-d3js-aka-clippath.html
				.attr('clip-path', 'url(#rect-clip)') 
				.style('fill', 'none')
				.style('stroke-dasharray', ('5, 3'))
				.style('stroke', 'red')
				.style('stroke-opacity', 0.9)
				.style('stroke-width', 0.8)
				;
		};

		//Afegir els eixos
		svg.append("g")
			.attr("class", "y_axis")
			.call(yAxis);
			
		svg.append("g")
			.attr("class", "x_axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
			
		//Titol
		svg.append('g')
	        .append('text')
	        .attr("text-anchor", "start")  
			.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))+10) +","+10+")")
	        .style("font-size", "11px")
	        .style("font-family", "open sans")
	        .text(_.capitalize(sefa_config.translates.get_translate(s_sp)));
	}); //Fi de bucle per a totes els espËcies dins d'un parc
	
};//Fi de graph_by_population_trend_by_park()

GRAPH_SEFA.prototype.graph_by_population_trend = function(){
	
	var d = manage_sd.get_population_trend();

	//defaults
	var defaults={
		factor_escala_1 : 1.25,
		factor_escala_2 : 2,
	    //Margins
		margin : {top: 10, right: 20, bottom: 20, left: 50},
		//Absolute
		abs_height : 200,
		abs_width : 300,
		width : 0,
		height : 0,
		scaleX : {}
	}; //Fi de Defaults
	
	defaults.width = defaults.abs_width - defaults.margin.left - defaults.margin.right;
	defaults.height = defaults.abs_height - defaults.margin.top - defaults.margin.bottom;
	defaults.scaleX = d3.scale.linear()
	          			.range([0, defaults.width])
	          			.domain([_.minBy(d,function(w){return w.DATE;}).DATE,_.maxBy(d,function(w){return w.DATE;}).DATE])
	          			.nice();
	


	// **********************************************
	//	Bucle per parc
	// **********************************************
	_.forEach(_.uniqBy(d, function(w){return w.PARK;}), function(q){

		var s_div = 'sefa_graphs_population_trend_'+q.PARK;
		if(!$('#'+s_div+'_').length){return;}

		//Omplo el DIV per parc
		$('#'+s_div+'_').append('<div><div class="panel panel-default"><div class="panel-heading">'+sefa_config.translates.get_translate(q.PARK)+'</div><div id="'+s_div+'" class="panel-body"></div></div></div>');

		graphs.graph_by_population_trend_by_park(q.PARK, _.filter(d, function(w){return _.isEqual(w.PARK, q.PARK);}), defaults);
	});
};

GRAPH_SEFA.prototype.graph_by_anual_surveyed_localities = function(){

	var div = 'sefa_graphs_anual_surveyed_localities';
	if(!$('#'+div).length){return;}
	var id_div = div;
	
	var s = manage_sd.get_anual_surveyed_localities();
	
	var factor_escala = 1.25;
	
	// **********************************
	// Defaults
	// **********************************
    //Margins
	var margin = {top: 20, right: 20, bottom: 20, left: 25};
	//Absolute
	var abs_height = 200;
	var abs_width = 400;
	width = abs_width - margin.left - margin.right,
	height = abs_height - margin.top - margin.bottom;
	
	//Escala X: linear
	var scaleX = d3.scale.linear()
	          .range([0, width])
	          .domain(s.rx)
	          .nice();

	//Escala Y: linear
	var scaleY = d3.scale.linear()
		.range([height, 0])
		.domain([s.ry[0],s.ry[1]*factor_escala])
		.nice()
		;

	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
	            .tickFormat(d3.format('d'))
	            //.tickPadding(10)
	            ;
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left")
	            //.innerTickSize(0)
	            //.outerTickSize(0)
	            .ticks(4)
	            .tickFormat(d3.format('d'))
			            ;
	//Objecte grafic
	var svg = d3.select('div#'+div).append("svg")
		.attr('id',id_div)
	    .style('width', width + margin.left + margin.right+'px')
	    .style('height', height + margin.top + margin.bottom+'px')
	    .attr('class', 'img-responsive')
		.append('g')
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var line = d3.svg.line()
	    .x(function(u){return scaleX(u.year);})
	    .y(function(u){return scaleY(u.count);})
    ;
	
	svg.append('path')
		.attr('d', line(s.d))
		.style('fill', 'none')
		.style('stroke', '#a50f15')
		.style('stroke-width', 1)
		.style('stroke-opacity', 0.8)
		;

	//VËrtexs de les lÌnies
	_.forEach(s.d, function(w){
		svg.append('circle')
			.attr('cx', scaleX(w.year))
			.attr('cy', scaleY(w.count))
			.attr('r', 3)
			.style('fill', '#67000d')
			.style('fill-opacity',1)
			.append('svg:title')
			.text(sefa_config.translates.get_translate('n_total')+w.count+' ('+w.year+')')
			;
	});

	//Afegir els eixos
	svg.append("g")
		.attr("class", "y_axis")
		.call(yAxis);
		
	svg.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
		
	//Titol
	svg.append('g')
        .append('text')
        .attr("text-anchor", "start")  
		.attr("transform", "translate("+ ((scaleX(scaleX.domain()[0]))-margin.left) +","+ ((scaleY(scaleY.domain()[1]))-(margin.top/2))   +")")
        .style("font-size", "11px")
        .style("font-family", "open sans")
        .text(_.capitalize(sefa_config.translates.get_translate('surveyed_localities')));
};function LAYER(label, layer_tile)
{
	this.label = label;
	this.layer_tile = layer_tile;
};
LAYER.prototype.gettilelayer = function()
{
	return this.layer_tile;
};

LAYER.prototype.getvectorlayer = function()
{
	return this.layer_tile;
};

//Retorna un array de layers SEFA
function CAPES_SEFA()
{
	this.sefa_layers = [];
	this.sefa_layers.push(new LAYER(
		'sefa_utm1x1', 
		new ol.layer.Vector(
		{
			source: construct_fishnet(),
			opacity: 0.5,
			style: define_fishnet_style(),
			visible: true
		})
	));
}; //Fi de CAPES_SEFA()

//M√®tode que retorna un objecte layer indicant el nom de la capa
CAPES_SEFA.prototype.get_vectorlayer = function(nom_layer)
{
	return _.find(this.sefa_layers, function(d){return d.label==nom_layer;}).getvectorlayer();
};


function construct_fishnet()
{
	var vectorSource = new ol.source.Vector();
	_.forEach(fishnet.cells, function(c){
		vectorSource.addFeature(new ol.Feature({
    		name: c.UTMX+','+c.UTMY,
    		geometry: new ol.geom.Polygon(c.get_polygonXY())
		}));
	});
	return vectorSource;
}

function define_fishnet_style()
{
	return new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'red'
			}),
		stroke: new ol.style.Stroke({
			color: 'red',
			width: 1
    	})
    });	
}//Retorna un array d'objectes de tipus ICC amb les capes WMTS
function CAPES_DIBA()
{
	this.diba_layers = [];
	
	this.diba_layers.push(new LAYER(
	'limitsxpn', 
	new ol.layer.Tile(
	{
		source: new ol.source.TileWMS(
		{
			url: 'http://sitmun.diba.cat/wms/servlet/XPE50?',
			params: 
			{
				'LAYERS': 'XPE50_111L',
				'VERSION': '1.1.1',
				'FORMAT': 'image/png',
				'TILED': true,
				'SERVICE': 'WMS',
				'TRANSPARENT': true,
				'BGCOLOR': 0x000000,
				'OUTLINE': true,
				'STYLE': 'opacity:0.8',
				'SRS': sefa_config.get_map_epsg(),
			}
		})
	})
	));
}; //Fi de CAPES_DIBA()

//M√®tode que retorna un objecte tile indicant el nom de la capa
CAPES_DIBA.prototype.get_tilelayer = function(nom_layer)
{
	return _.find(this.diba_layers, function(d){return d.label==nom_layer;}).gettilelayer();
};

//Retorna un array d'objectes de tipus ICC amb les capes WMTS
function CAPES_ICC()
{
	this.icc_layers = [];
	
	this.icc_layers.push(new LAYER('topo', wmts('topo')));
	this.icc_layers.push(new LAYER('topogris', wmts('topogris')));
	this.icc_layers.push(new LAYER('orto', wmts('orto')));
	this.icc_layers.push(new LAYER('ortogris', wmts('ortogris')));
	
	function wmts(layer_name)
	{
		return new ol.layer.Tile(
		{
			opacity: 0.7,
			extent: sefa_config.get_map_extent(),
			source: new ol.source.TileWMS(
			{
				//attributions: [attribution],
				url: 'http://mapcache.icc.cat/map/bases/service?',
				params: {'LAYERS': layer_name}
			})
		});
	};
};

//M√®tode que retorna un objecte tile indicant el nom de la capa
CAPES_ICC.prototype.get_tilelayer = function(nom_layer)
{
	return _.find(this.icc_layers, function(d){return d.label==nom_layer;}).gettilelayer();
};
function mapa_sefa_localitats_quadricula()
{
	//Si no s'ha declarat el DIV per contenir el mapa, no faig res
	if (!$("#mslq").length){return;}
	
	//Actualitzo el t√≠tol
	$('div#mapa_sefa_localitats_quadricula_heading').html('<h1 class="panel-title">'+_.capitalize(sefa_config.translates.get_translate('locations'))+'</h1>');

	//Determino les mides del mapa:
	$().attr('height','700px')
	   .attr('width','100%');
	
	//Inst√†ncies dels objectes amb les capes WMS 
	var icc = new CAPES_ICC();
	var diba = new CAPES_DIBA();
	var sefa = new CAPES_SEFA();
	
	//MAPA
	var map = new ol.Map(
	{
		target: 'mslq',
		interactions: ol.interaction.defaults({mouseWheelZoom:false}),
		view: new ol.View({
			projection: sefa_config.get_map_projection(),
			center: sefa_config.get_map_centerXY(),
			zoom: sefa_config.get_map_zoom_initial(),
			resolutions: sefa_config.get_map_resolutions(),
			extent: sefa_config.get_map_extent()
		})
	});

	//Calculo l'extent del mapa segons la vista inicial
	mapextent = map.getView().calculateExtent(map.getSize());

	//Inst√†ncia de l'objecte amb la llista de controls del mapa
	var controls_list = new CONTROLS(mapextent);
	_.each(controls_list.getControls(), function(d){map.addControl(d)});

	//TODO fixar el PAN sobre el mapa a mapextent.

	//Consulta sobre el mapa
	map.on('click', function(evt) {displayFeatureInfo(evt.pixel, evt.coordinate);});
	
	//Mousemove
	/*
	$(map.getViewport()).on('mousemove', function(evt) {
  			var pixel = map.getEventPixel(evt.originalEvent);
  			displayFeatureInfo(pixel);
	});
	*/

	addLayer_check(map, icc.get_tilelayer('topogris'));
	addLayer_check(map, diba.get_tilelayer('limitsxpn'));
	addLayer_check(map, sefa.get_vectorlayer('sefa_utm1x1'));


	var displayFeatureInfo = function(pixel, coords) {
	
			map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				view_popup(map, coords, feature.get('name'));
			});
	};

};//Fi de mapa_sefa_localitats_quadricula()


function CONTROLS(mapextent)
{
	this.c = [
	
	new ol.control.ScaleLine(
	{
		units: 'metric',
		minWidth: 100
	}),

	new ol.control.MousePosition(
	{
		undefinedHTML: '',
		//projection: ol.proj.get('EPSG:4326'),
		units: 'meters',
		coordinateFormat: function(coordinate) {return ol.coordinate.format(coordinate, '{x}, {y}', 0)},
	}),
	
	new ol.control.ZoomToExtent({extent: mapextent}),
	new ol.control.Zoom()
	];
};

CONTROLS.prototype.getControls = function()
{
	return this.c;	
};

function view_popup(map, pixel, feature_name)
{
	//Exemple: http://jsfiddle.net/ro1ptr0k/26/

	//Si ja hi ha un Overlay obert, no faig res
	if(map.getOverlays().getArray().length){return;};

	//Creo l'element DIV id=popup
	$('#mslq').append('<div id="popup" class="ol-popup"></div>');
	
	$newpopupcloser = $('<a/>')
					 .attr('href', '#')
					 .attr('id', 'popup-closer')
					 .addClass('ol-popup-closer')
					 .on('click', function(){
										map.removeOverlay(overlay);
										$('#popup-closer').blur();
										return false;		
										});
	$('#popup').append($newpopupcloser);

	//Busco a les dades, totes les localitats dins de la quadr√≠cula
	var r = manage_sd.get_locations_by_feature_name(feature_name);
	
	//Creo la taula amb els resultats
	$newtable = $('<table/>')
			    .addClass('table')
			    .addClass('table-condensed');

	$newtable.append('<thead>'+
		'<tr>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('park'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('species'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('core'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('method'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('period'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('date_start'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('date_end'))+'</th>'+
			'<th>'+_.capitalize(sefa_config.translates.get_translate('n_census'))+'</th>'+
		'</tr>'+
	'</thead>'+
	'<tbody>'
	);
	
	_.forEach(r, function(q){
		
		$newtable.append('<tr>'+
				'<td>'+sefa_config.translates.get_translate(q.ID_PARC)+'</td>'+
				'<td class=\'specie\'>'+q.ESPECIE+'</td>'+
				'<td>'+q.NUCLI_POBLACIONAL+'</td>'+
				'<td>'+q.METODOLOGIA_SEGUIMENT+'</td>'+
				'<td>'+q.PERIODICITAT+'</td>'+
				'<td>'+q.DATA_CENS_FIRST+'</td>'+
				'<td>'+q.DATA_CENS_LAST+'</td>'+
				'<td>'+q.N_CENSOS+'</td>'+
				'</tr>'
			);
		});

	$newtable.append('</tbody>');

	//Afegeixo la taula al contingut
	$newpopupcontent = $('<div/>');
	$('#popup').append($newpopupcontent);
	$newpopupcontent.append($newtable);

	
	//Add Overlay
	var overlay = new ol.Overlay({element: $('#popup')[0]});
	map.addOverlay(overlay);
	overlay.setPosition(pixel);
}; //Fi de view_popup


//Check if layer exist in map, return true/false
function map_layer_check(map, layer)
{
		if(!_.isUndefined(_.find(map.getLayers().getArray(), function(d){return d == layer;})))
		{return true;}
		else{return false;}
}; //Fi de map_layer_check

function addLayer_check(map, layer)
{
	if(!map_layer_check(map, layer))
	{map.addLayer(layer);}
}; //Fi de addLayer_check(map, layer)

function removeLayer_check(map, layer)
{
	if(map_layer_check(map, layer))
	{map.removeLayer(layer);}
}; //Fi de removeLayer_check
function TRANSLATES()
{
	this.language_list = ['ca','es','en'];
	this.lang_select;
	this.translate = [];
};//Fi de translate

TRANSLATES.prototype.set_lang = function(lang) 
{
    this.lang_select = lang;
};

TRANSLATES.prototype.get_translate = function(value)
{
	var langselect = this.lang_select;
	var t = _.find(this.translate, function(x){return x.value == value});
	if(_.isUndefined(t))
	{
		//No la trobat, retorno value
		return value;
	}
	else
	{
		var tt = _.find(t.chains, function(x){
			return x.lang == langselect});
		if(_.isUndefined(tt))
		{
			//No he trobat la cadena amb la llengua seleccionada
			return value;
		}
		else
		{
			//return utf8.encode(tt.text);
			return tt.text;
		} 
	}
};

function TRANSLATE(value)
{
	this.value = value;
	this.chains = [];
};

TRANSLATE.prototype.set_chain = function(lang,text)
{
	this.chains.push(new CHAIN(lang,text));
};

function CHAIN(lang, text)
{
	this.lang = lang;
	this.text = text;
};

TRANSLATES.prototype.set_translates = function(value, lang, text)
{
	var t = _.find(this.translate, function(x){return x.value == value});
	if(_.isUndefined(t))
	{
		t = new TRANSLATE(value);
		t.set_chain(lang,text);
		this.translate.push(t);
	}
	else
	{
		t.set_chain(lang,text);
	}
};

TRANSLATES.prototype.load_translates = function()
{
	//this.set_translates(value,lang,text);
	this.set_translates('n_total','ca','n='); //--> N=, total dels piegraphs
	this.set_translates('locations','ca','localitats');
	
	//Cap√ßaleres de la taula amb els resultats al mapa
	this.set_translates('park','ca','parc');
	this.set_translates('species','ca','esp√®cie');
	this.set_translates('method','ca','m√®tode');
	this.set_translates('period','ca','per√≠ode');
	this.set_translates('date_start','ca','inici');
	this.set_translates('date_end','ca','fi');
	this.set_translates('n_census','ca','censos');
	this.set_translates('core','ca','nucli');
	
	//Gr√†fics
	this.set_translates('others','ca','altres');
	this.set_translates('methods','ca','Metodologies');
	this.set_translates('species_by_protectedarea','ca','esp√®cies d\'inter√®s (amb localitats) per parc');
	this.set_translates('locations_by_protectedarea','ca','Localitats per parc');
	this.set_translates('species_protecionlevel','ca','Esp√®cies per categoria d\'inter√®s');
	this.set_translates('species_protectioncatalog','ca','Esp√®cies per categories CFAC');
	this.set_translates('periodicity','ca','periodicitat');
	this.set_translates('number','ca','n√∫mero');
	this.set_translates('graph_species_tracked_by_protectionlevel_title','ca','Esp√®cies amb seguiment per categoria d\'inter√®s');
	this.set_translates('graph_species_tracked_by_protectioncatalog_title','ca','Esp√®cies amb seguiment per categoria del CFAC');
	this.set_translates('date','ca','data');
//	this.set_translates('graph_species_tracked_by_tracked_dates_acumulated_title','ca','Data dels censos i per√≠ode de seguiment');
	this.set_translates('graph_species_tracked_by_tracked_dates_acumulated_title','ca','Per√≠ode de seguiment');
	this.set_translates('locations','ca','localitats');
	this.set_translates('locations_with_census','ca','amb seguiment');
	this.set_translates('graph_groupby_species_by_num_locations_title','ca','Localitats amb seguiment sobre el total per esp√®cie');
	this.set_translates('locations_number','ca','n√∫mero de localitats');
	this.set_translates('graph_groupby_species_by_num_census_title','ca','N√∫mero de censos per esp√®cie');
	this.set_translates('graph_locations_species_protectedarea','ca','Localitats per esp√®cie i parc');

	//group by method
	this.set_translates('Metodologia 2 - Recompte total','ca','M√®tode 2');
	this.set_translates('Metodologia 1 - Pres√®ncia / abs√®ncia','ca','M√®tode 1');
	this.set_translates('Metodologia 3 - Estimaci√≥ amb parcel¬∑les','ca','M√®tode 3');
	this.set_translates('0','ca','Sense seguiment');
	
	
	//groupby_locations_by_protectedarea
	this.set_translates('MCO','ca','Montnegre i el Corredor');
	this.set_translates('SLI','ca','Serralada Litoral');
	this.set_translates('MSY','ca','Montseny');
	this.set_translates('SMA','ca','Serralada de Marina');
	this.set_translates('GUI','ca','Guilleries-Savassona');
	this.set_translates('GRF','ca','Garraf');
	this.set_translates('SLL','ca','Sant Lloren√ß del Munt i l\'Obac');
	this.set_translates('COL','ca','Collserola');
	this.set_translates('MTQ','ca','Montesquiu');
	this.set_translates('OLE','ca','Ol√®rdola');
	
	//groupby_species_by_protectioncatalog
	this.set_translates('E','ca','En perill');
	this.set_translates('V','ca','Vulnerable');
	this.set_translates('nopresent','ca','No present');

	//Tables
	this.set_translates('sefa_table_species_by_protectioncatalog_list_heading','ca','Llistat d\'esp√®cies per categories CFAC');
	this.set_translates('sefa_table_species_by_protectionlevel_list_heading','ca','llistat d\'esp√®cies per categories de prioritzaci√≥');
	this.set_translates('sefa_table_species_by_protectionlevel_protectioncatalog_list_heading','ca','Llistat d\'esp√®cies amb localitats introdu√Ødes a la base de dades del SEFA');

	this.set_translates('protecionlevel','ca','categoria de prioritzaci√≥');
	this.set_translates('protecioncatalog','ca','Categoria CFAC');

	//Impactes i amenaces

	this.set_translates('threats','ca','S√≠ntesi d\'amenaces');
	this.set_translates('impacts','ca','S√≠ntesi d\'impactes');
	this.set_translates('year','ca','any');
	this.set_translates('totals','ca','totals');
	this.set_translates('total_for_year','ca','totals per any');

	this.set_translates('impacts_evolution','ca','Evoluci√≥ temporal dels impactes');
	this.set_translates('threats_evolution','ca','Evoluci√≥ temporal de les amenaces');
	

	
	this.set_translates('surveyed_localities','ca','localitats censades');


	this.set_translates('1. Canvi clim√†tic','ca','Canvi clim√†tic');
	this.set_translates('2. Reducci√≥ de l‚Äôh√†bitat','ca','Reducci√≥ h√†bitat');
	this.set_translates('3. Incendis forestals','ca','Incendis forestals');
	this.set_translates('4. Alteraci√≥ del medi h√≠dric','ca','Alteraci√≥ medi h√≠dric');
	this.set_translates('5. Pr√†ctiques forestals inadequades','ca','Pr√†ctiques forestals');
	this.set_translates('6. Pol¬∑luci√≥','ca','Pol¬∑luci√≥');
	this.set_translates('7. Canvis en el medi com a resultat de l‚Äôabandonament de pr√†ctiques agroramaderes','ca','Abandonament agroramader');
	this.set_translates('8. Canvis en el medi com a resultat de la intensificaci√≥ de pr√†ctiques agroramaderes','ca','Intensificaci√≥ agroramadera');
	this.set_translates('9. Altres alteracions de l‚Äôh√†bitat','ca','Altres alteracions h√†bitat');
	this.set_translates('10. Compet√®ncia','ca','Compet√®ncia');
	this.set_translates('11. Predaci√≥','ca','Predaci√≥');
	this.set_translates('12. Parasitisme','ca','Parasitisme');
	this.set_translates('13. Malalties','ca','Malalties');
	this.set_translates('14. Hibridaci√≥','ca','Hibridaci√≥');
	this.set_translates('15. Poblaci√≥ o superf√≠cie recoberta petita','ca','Poblaci√≥ o superf√≠cie recoberta petita');
	this.set_translates('16. A√Øllament biogeogr√†fic','ca','A√Øllament biogeogr√†fic');
	this.set_translates('17. Freq√ºentaci√≥','ca','Freq√ºentaci√≥');
	this.set_translates('18. Altres','ca','Altres');

	this.set_translates('Aegpod','ca','Aegopodium podagraria');
	this.set_translates('Arclap','ca','Arctium lappa');
	this.set_translates('Arecav','ca','Arenaria fontqueri ssp. cavanillesiana');
	this.set_translates('Arisim','ca','Arisarum simorrhinum var. simorrhinum');
	this.set_translates('Asplae','ca','Asperula laevigata');
	this.set_translates('Aspsep','ca','Asplenium septentrionale');
	this.set_translates('Botmat','ca','Botrychium matricariifolium');
	this.set_translates('Brarob','ca','Brassica oleracea ssp. robertiana');
	this.set_translates('Caramp','ca','Cardamine amporitana');
	this.set_translates('Cardep','ca','Carex depauperata');
	this.set_translates('Carvir','ca','Carex flava ssp. viridula');
	this.set_translates('Cargri','ca','Carex grioletii');
	this.set_translates('Carpra','ca','Carex praecox');
	this.set_translates('Carcer','ca','Carpesium cernuum');
	this.set_translates('Cenhan','ca','Centaurea paniculata spp. hanrii');
	this.set_translates('Chahum','ca','Chamaerops humilis');
	this.set_translates('Chetin','ca','Cheilanthes tinaei');
	this.set_translates('Cicfil','ca','Cicendia filiformis');
	this.set_translates('Ciscri','ca','Cistus crispus');
	this.set_translates('Cislad','ca','Cistus ladanifer');
	this.set_translates('Coevir','ca','Coeloglossum viride');
	this.set_translates('Consic','ca','Convolvulus siculus');
	this.set_translates('Cosvel','ca','Cosentinia vellea');
	this.set_translates('Delbol','ca','Delphinium bolosii');
	this.set_translates('Dicalb','ca','Dictamnus albus');
	this.set_translates('Digobs','ca','Digitalis obscura');
	this.set_translates('Dippil','ca','Dipsacus pilosus');
	this.set_translates('Epiaph','ca','Epipogium aphyllum');
	this.set_translates('Equhye','ca','Equisetum hyemale');
	this.set_translates('Ericin','ca','Erica cinerea');
	this.set_translates('Eupdul','ca','Euphorbia dulcis ssp. dulcis');
	this.set_translates('Galsca','ca','Galium scabrum');
	this.set_translates('Gymdry','ca','Gymnocarpium dryopteris');
	this.set_translates('Halhal','ca','Halimium halimifolium');
	this.set_translates('Hyppul','ca','Hypericum pulchrum');
	this.set_translates('Ileaqu','ca','Ilex aquifolium');
	this.set_translates('Isodur','ca','Isoetes durieui');
	this.set_translates('Latsqu','ca','Lathraea squamaria');
	this.set_translates('Latcir','ca','Lathyrus cirrhosus');
	this.set_translates('Lavolb','ca','Lavatera olbia');
	this.set_translates('Lilmar','ca','Lilium martagon');
	this.set_translates('Limgir','ca','Limonium girardianum');
	this.set_translates('Lonnig','ca','Lonicera nigra');
	this.set_translates('Lycsel','ca','Lycopodium selago');
	this.set_translates('Melcat','ca','Melampyrum catalaunicum');
	this.set_translates('Melnut','ca','Melica nutans');
	this.set_translates('Nardub','ca','Narcissus dubius');
	this.set_translates('Orcmaj','ca','Orchis majalis');
	this.set_translates('Oroict','ca','Orobanche elatior ssp. icterica');
	this.set_translates('Osmreg','ca','Osmunda regalis');
	this.set_translates('Peuoff','ca','Peucedanum officinale');
	this.set_translates('Phepur','ca','Phelipanche purpurea');
	this.set_translates('Pinvul','ca','Pinguicula vulgaris');
	this.set_translates('Polver','ca','Polygonatum verticillatum');
	this.set_translates('Polbis','ca','Polygonum bistorta');
	this.set_translates('Potnat','ca','Potamogeton natans');
	this.set_translates('Potmon','ca','Potentilla montana');
	this.set_translates('Potpyr','ca','Potentilla pyrenaica');
	this.set_translates('Prulus','ca','Prunus lusitanica');
	this.set_translates('Samrac','ca','Sambucus racemosa');
	this.set_translates('Saxcat','ca','Saxifraga callosa ssp. catalaunica');
	this.set_translates('Saxgen','ca','Saxifraga genesiana');
	this.set_translates('Saxpan','ca','Saxifraga paniculata');
	this.set_translates('Saxvay','ca','Saxifraga vayredana');
	this.set_translates('Selden','ca','Selaginella denticulata');
	this.set_translates('Servom','ca','Serapias vomeracea');
	this.set_translates('Silmut','ca','Silene mutabilis');
	this.set_translates('Silvir','ca','Silene viridiflora');
	this.set_translates('Spipar','ca','Spiraea crenata ssp. parvifolia');
	this.set_translates('Spiaes','ca','Spiranthes aestivalis');
	this.set_translates('Stapal','ca','Stachys palustris');
	this.set_translates('Stramp','ca','Streptopus amplexifolius');
	this.set_translates('Sucbal','ca','Succowia balearica');
	this.set_translates('Tamafr','ca','Tamarix africana');
	this.set_translates('Taxbac','ca','Taxus bacatta');
	this.set_translates('Viobub','ca','Viola bubanii');
	this.set_translates('Viocat','ca','Viola suavis ssp. catalonica');
	this.set_translates('Vitagn','ca','Vitex agnus-castus');
	this.set_translates('Vitsyl','ca','Vitis vinifera ssp. sylvestris');



}; //Fi de load_translates






/* ****************************************************************************/
//							Objecte SEFA_CONFIG
/* ****************************************************************************/
function SEFA_CONFIG()
{
	this.translates = new TRANSLATES();
	this.translates.set_lang('ca');
	this.translates.load_translates();

	//Fishnet resolution, in meters
	this.fishnet_resolution = 1000
	
	//Maps
	this.map_centerXY = [423850,4617000];
	this.map_zoom_initial = 0;
	this.map_EPSG = 'EPSG:25831';
	this.map_extent = [257904,4484796,535907,4751795];
	this.map_projection = ol.proj.get('EPSG:25831');
	this.map_projection.setExtent(this.get_map_extent());
	this.map_resolutions = [275,100,50,25,10,5,2,1,0.5,];


}; //Fi de SEFA_CONFIG()

/* ****************************************************************************/
//									METHODS
/* ****************************************************************************/

SEFA_CONFIG.prototype.get_map_centerXY = function(){return this.map_centerXY;}
SEFA_CONFIG.prototype.get_map_zoom_initial = function(){return this.map_zoom_initial;}
SEFA_CONFIG.prototype.get_map_epsg = function(){return this.map_EPSG;}
SEFA_CONFIG.prototype.get_map_resolutions = function(){return this.map_resolutions;}
SEFA_CONFIG.prototype.get_map_projection = function(){return this.map_projection;}
SEFA_CONFIG.prototype.get_map_extent = function(){return this.map_extent;}






//Configuraci√≥ i tractament de les dades
var sefa_config = new SEFA_CONFIG();
var fishnet = new FISHNET();
var manage_sd = new MANAGE_SD();
var graphs = new GRAPH_SEFA();
var tables = new SEFA_TABLES();

	
function main_()
{
	create_page();

	mapa_sefa_localitats_quadricula();

	graphs.graph_by_method();
	graphs.graph_by_period();

	graphs.graph_locations_by_protectedarea();	
	graphs.graph_species_by_protectionlevel();
	graphs.graph_species_by_protectioncatalog();
	graphs.graph_species_by_protectedarea();
	
	tables.table_species_by_protectionlevel_list();
	tables.table_species_by_protectioncatalog_list();
	tables.table_species_by_protectionlevel_protectioncatalog_list();

	graphs.graph_species_tracked_by_protectionlevel();
	graphs.graph_species_tracked_by_protectioncatalog();
	graphs.graph_species_tracked_by_tracked_dates_acumulated();

	graphs.graph_groupby_species_by_num_locations();
	graphs.graph_groupby_species_by_num_locations_by_park();

	graphs.graph_groupby_species_by_num_census();
	graphs.graph_protectedarea_species_locations();

	graphs.graph_by_threats();
	graphs.graph_by_impacts();

	graphs.graph_by_impacts_histo();
	graphs.graph_by_threats_histo();

	graphs.graph_by_population_trend();
	
	graphs.graph_by_anual_surveyed_localities();
	
} // Fi de main_()
