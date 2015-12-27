function formatNumber(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ' ' + '$2');
	}
	return x1 + x2;
}

function formatDate(ms)
{
    date = new Date(ms);

    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}

function initCharts(data) {
	$(".chart").each(function () {
    var chart = this;
		var chartData = data[$(chart).attr("data-key")];
		var chartType =$(chart).attr("data-type");

    options = {
     container: chart,
     chart: {
        renderTo: chart,
        defaultSeriesType: chartType,
        zoomType: 'xy'
     },
     title: {
        text: $(chart).attr("title")
     },
     xAxis: {
        type: $(chart).attr("data-type") != 'line' ? null : 'datetime',
        categories: chartData.categories,
        title: {
           text: $(chart).attr("data-x-title")
        }
     },
     yAxis: {
        title: {
           text: $(chart).attr("data-y-title")
        },
        startOnTick: $(chart).attr("data-type") != 'line',
        showFirstLabel: $(chart).attr("data-type") != 'line'
     },
     legend: {
        enabled: false
     },
     tooltip: {
         formatter: function () {
            return eval($(chart).attr("data-tooltip"));
         }
     },
    plotOptions: {
        line: {
            marker: {
               enabled: false,
               states: {
                  hover: {
                     enabled: true
                  }
               }
            }
         }
	    },
	    series: [],
	    credits: {
	        enabled: false
	    }
	   }

		if ($(chart).attr("data-multiple")) {
			h = chartData.series_data;
			for (s in h)
			{
				 options['series'].push({
						 type: $(chart).attr("data-type"),
						 name: s,
						 data: h[s],
						 pointInterval: parseInt($(chart).attr("data-series-interval")) || null,
						 pointStart: Date.parse(chartData.series_start) || null
					});
			}
			options.legend.enabled = true;
		} else
	    options['series'].push({
	        type: $(chart).attr("data-type"),
	        data: chartData.series_data,
	        pointInterval: parseInt($(chart).attr("data-series-interval")) || null,
	        pointStart: Date.parse(chartData.series_start) || null,
	        dataLabels: {}
	     });

	   new Highcharts.Chart(options);
	});
}

function initDataValues(data) {
	$("#data-value-total").html(formatNumber(data.value_total));

	$("#data-value-longest-length").html(data.value_length_extremes.longest.length);
	$("#data-value-longest-name").html(data.value_length_extremes.longest.name);
	$("#data-value-shortest-length").html(data.value_length_extremes.shortest.length);
	$("#data-value-shortest-name").html(data.value_length_extremes.shortest.name);
}

function initScrollToTop() {
	/* set variables locally for increased performance */
	var scroll_timer;
	var displayed = false;
	var $message = $('#move-to-top');
	var $window = $(window);
	var top = $(document.body).children(0).position().top;

	/* react to scroll event on window */
	$window.scroll(function () {
		window.clearTimeout(scroll_timer);
		scroll_timer = window.setTimeout(function () { // use a timer for performance
			if($window.scrollTop() <= top) // hide if at the top of the page
			{
				displayed = false;
				$message.fadeOut(500);
			}
			else if(displayed == false) // show if scrolling down
			{
				displayed = true;
				$message.stop(true, true).show().click(function () { $message.fadeOut(500); });
			}
		}, 100);
	});

		$message.click(function() {
		$('html, body').animate({ scrollTop:top }, 100);
	});
}

$(function() {
	$.getJSON("data/charts.json", function(json) {
		initCharts(json);
		initDataValues(json);
	});

	initScrollToTop();
});
