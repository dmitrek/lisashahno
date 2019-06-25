var lteIE8, isPermalink, infiniteScroll, IOS;

(function($){$.fn.jTruncate=function(h){var i={length:300,minTrail:20,moreText:"more",lessText:"less",ellipsisText:"...",moreAni:"",lessAni:""};var h=$.extend(i,h);return this.each(function(){obj=$(this);var a=obj.html();if(a.length>h.length+h.minTrail){var b=a.indexOf(' ',h.length);if(b!=-1){var b=a.indexOf(' ',h.length);var c=a.substring(0,b);var d=a.substring(b,a.length-1);obj.html(c+'<span class="truncate_ellipsis">'+h.ellipsisText+'</span>'+'<span class="truncate_more">'+d+'</span>');obj.find('.truncate_more').css("display","none");obj.append('<div class="clearboth">'+'<a href="#" class="truncate_more_link">'+h.moreText+'</a>'+'</div>');var e=$('.truncate_more_link',obj);var f=$('.truncate_more',obj);var g=$('.truncate_ellipsis',obj);e.click(function(){if(e.text()==h.moreText){f.show(h.moreAni);e.text(h.lessText);g.css("display","none")}else{f.hide(h.lessAni);e.text(h.moreText);g.css("display","inline")}return false})}}})}})(jQuery);
jInit = null;
(function(a, b) {
    var e, f, d = b.event;
    "use strict";
    d.special.smartresize = {
        setup: function() {
            b(this).bind("resize", d.special.smartresize.handler);
        },
        teardown: function() {
            b(this).unbind("resize", d.special.smartresize.handler);
        },
        handler: function(a, c) {
            var d = this, f = arguments;
            a.type = "smartresize", e && clearTimeout(e), e = setTimeout(function() {
                b.event.handle.apply(d, f);
            }, c === "execAsap" ? 0 : 100);
        }
    }, b.fn.smartresize = function(a) {
        return a ? this.bind("smartresize", a) : this.trigger("smartresize", [ "execAsap" ]);
    }, b.Mason = function(a, c) {
        this.element = b(c), this._create(a), this._init();
    }, b.Mason.settings = {
        isResizable: !0,
        isAnimated: !1,
        animationOptions: {
            queue: !1,
            duration: 500
        },
        gutterWidth: 0,
        isRTL: !1,
        isFitWidth: !1,
        containerStyle: {
            position: "relative"
        }
    }, b.Mason.prototype = {
        _filterFindBricks: function(a) {
            var b = this.options.itemSelector;
            return b ? a.filter(b).add(a.find(b)) : a;
        },
        _getBricks: function(a) {
            var b = this._filterFindBricks(a).css({
                position: "absolute"
            }).addClass("masonry-brick");
            return b;
        },
        _create: function(c) {
            var d, e, f, g;
            this.options = b.extend(!0, {}, b.Mason.settings, c), this.styleQueue = [];
            d = this.element[0].style;
            this.originalStyle = {
                height: d.height || ""
            };
            e = this.options.containerStyle;
            for (f in e) this.originalStyle[f] = d[f] || "";
            this.element.css(e), this.horizontalDirection = this.options.isRTL ? "right" : "left", this.offset = {
                x: parseInt(this.element.css("padding-" + this.horizontalDirection), 10),
                y: parseInt(this.element.css("padding-top"), 10)
            }, this.isFluid = this.options.columnWidth && typeof this.options.columnWidth == "function";
            g = this;
            setTimeout(function() {
                g.element.addClass("masonry");
            }, 0), this.options.isResizable && b(a).bind("smartresize.masonry", function() {
                g.resize();
            }), this.reloadItems();
        },
        _init: function(a) {
            this._getColumns(), this._reLayout(a);
        },
        option: function(a) {
            b.isPlainObject(a) && (this.options = b.extend(!0, this.options, a));
        },
        layout: function(a, b) {
            var c, d, e, f, g, h, i;
            for (c = 0, d = a.length; c < d; c++) this._placeBrick(a[c]);
            e = {};
            e.height = Math.max.apply(Math, this.colYs);
            if (this.options.isFitWidth) {
                f = 0;
                c = this.cols;
                while (--c) {
                    if (this.colYs[c] !== 0) break;
                    f++;
                }
                e.width = (this.cols - f) * this.columnWidth - this.options.gutterWidth;
            }
            this.styleQueue.push({
                $el: this.element,
                style: e
            });
            g = this.isLaidOut ? this.options.isAnimated ? "animate" : "css" : "css", h = this.options.animationOptions;
            for (c = 0, d = this.styleQueue.length; c < d; c++) i = this.styleQueue[c], i.$el[g](i.style, h);
            this.styleQueue = [], b && b.call(a), this.isLaidOut = !0;
        },
        _getColumns: function() {
            var a = this.options.isFitWidth ? this.element.parent() : this.element, b = a.width();
            this.columnWidth = this.isFluid ? this.options.columnWidth(b) : this.options.columnWidth || this.$bricks.outerWidth(!0) || b, this.columnWidth += this.options.gutterWidth, this.cols = Math.floor((b + this.options.gutterWidth) / this.columnWidth), this.cols = Math.max(this.cols, 1);
        },
        _placeBrick: function(a) {
            var e, f, g, h, i, j, k, l, m, n, o, c = b(a), d = Math.ceil(c.outerWidth(!0) / this.columnWidth);
            d = Math.min(d, this.cols);
            if (d === 1) f = this.colYs; else {
                e = this.cols + 1 - d, f = [];
                for (h = 0; h < e; h++) g = this.colYs.slice(h, h + d), f[h] = Math.max.apply(Math, g);
            }
            i = Math.min.apply(Math, f), j = 0;
            for (k = 0, l = f.length; k < l; k++) if (f[k] === i) {
                j = k;
                break;
            }
            m = {
                top: i + this.offset.y
            };
            m[this.horizontalDirection] = this.columnWidth * j + this.offset.x, this.styleQueue.push({
                $el: c,
                style: m
            });
            n = i + c.outerHeight(!0), o = this.cols + 1 - l;
            for (k = 0; k < o; k++) this.colYs[j + k] = n;
        },
        resize: function() {
            var a = this.cols;
            this._getColumns(), (this.isFluid || this.cols !== a) && this._reLayout();
        },
        _reLayout: function(a) {
            var b = this.cols;
            this.colYs = [];
            while (b--) this.colYs.push(0);
            this.layout(this.$bricks, a);
        },
        reloadItems: function() {
            this.$bricks = this._getBricks(this.element.children());
        },
        reload: function(a) {
            this.reloadItems(), this._init(a);
        },
        appended: function(a, b, c) {
            var d;
            if (b) {
                this._filterFindBricks(a).css({
                    top: this.element.height()
                });
                d = this;
                setTimeout(function() {
                    d._appended(a, c);
                }, 1);
            } else this._appended(a, c);
        },
        _appended: function(a, b) {
            var c = this._getBricks(a);
            this.$bricks = this.$bricks.add(c), this.layout(c, b);
        },
        remove: function(a) {
            this.$bricks = this.$bricks.not(a), a.remove();
        },
        destroy: function() {
            var c, d;
            this.$bricks.removeClass("masonry-brick").each(function() {
                this.style.position = "", this.style.top = "", this.style.left = "";
            });
            c = this.element[0].style;
            for (d in this.originalStyle) c[d] = this.originalStyle[d];
            this.element.unbind(".masonry").removeClass("masonry").removeData("masonry"), b(a).unbind(".masonry");
        }
    }, b.fn.imagesLoaded = function(a) {
        var e, f, g, h, i;
        function c() {
            a.call(e, f);
        }
        function d(a) {
            var e = a.target;
            e.src !== h && b.inArray(e, i) === -1 && (i.push(e), --g <= 0 && (setTimeout(c), f.unbind(".imagesLoaded", d)));
        }
        e = this, f = e.find("img").add(e.filter("img")), g = f.length, h = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", i = [];
        return g || c(), f.bind("load.imagesLoaded error.imagesLoaded", d).each(function() {
            var a = this.src;
            this.src = h, this.src = a;
        }), e;
    };
    f = function(b) {
        a.console && a.console.error(b);
    };
    b.fn.masonry = function(a) {
        var c;
        if (typeof a == "string") {
            c = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var d = b.data(this, "masonry");
                if (!d) {
                    f("cannot call methods on masonry prior to initialization; attempted to call method '" + a + "'");
                    return;
                }
                if (!b.isFunction(d[a]) || a.charAt(0) === "_") {
                    f("no such method '" + a + "' for masonry instance");
                    return;
                }
                d[a].apply(d, c);
            });
        } else this.each(function() {
            var c = b.data(this, "masonry");
            c ? (c.option(a || {}), c._init()) : b.data(this, "masonry", new b.Mason(a, this));
        });
        return this;
    };
})(window, jQuery);

lteIE8 = $("html").is(".lte-ie8") ? true : false;

isPermalink = typeof isPermalink === "undefined" ? false : true;

infiniteScroll = typeof infiniteScroll === "undefined" ? false : true;

IOS = navigator.platform == "iPad" || navigator.platform == "iPhone" || navigator.platform == "iPod" ? true : false;

(function(a) {
    function b(b, d) {
        var e = b ? b : a(".post:not(.loaded)");
        e.each(function() {
            var i, j, k, m, n, o, p, q, r, b = a(this), e = b.attr("id").split("-")[1];
            if (b.hasClass("type-photo")) {
                g(b);
            }
            if (b.hasClass("type_audio")) {
                if (!IOS) {
                    if (d) {
                        i = b.find(".post_audio_player_ui").css("visibility", "hidden");
                        j = b.find(".js-string").html();
                        k = /\\x3cembed.+\\x3c\/embed\\x3e/;
                        m = j.match(k)[0].replace(/\\x3cembed/, '<embed wmode="opaque"');
                        i.append('<script type="text/javascript">replaceIfFlash(9,"audio_player_' + e + '",\'<div class="audio_player">' + m + "</div>')</script>").css("visibility", "visible");
                        b.find(".js-string").remove();
                    } else {
                        n = b.find(".audio_player");
                        o = n.html();
                        p = o.replace(/<embed\s/i, "<embed wmode='opaque' ");
                        n.html(p);
                        b.find(".js-string").remove();
                    }
                }
            }
            if (b.hasClass("type_video")) {
                if (d) {
                    q = b.find(".media");
                    if (/span id="?video_player/i.test(q.html())) {
                        j = b.find(".js-string").html();
                        r = j.split("x22video_player_" + e + "\\x22,")[1].replace(/\\'/g, "'").replace(/\\\\x26/g, "&").replace(/'\)\\x3c\/script\\x3e'/, "");
                        q.append('<script type="text/javascript">renderVideo("video_player_' + e + '", ' + r + "')</script>");
                    }
                }
                c(b);
            }
            b.addClass("loaded");
        });
    }
    function c(b) {
        var d, e, g, h, i, j, k, l, m, n, o, p;
        function c(a, b) {
            var c;
            if (b == "css") {
                c = (a.css("width") == "100%" ? vidWidth : parseInt(a.css("width"))) / parseInt(a.css("height"));
            } else {
                if (b == "attr") {
                    c = (a.attr("width") == "100%" ? vidWidth : parseInt(a.attr("width"))) / parseInt(a.attr("height"));
                }
            }
            return Math.round(vidWidth / c);
        }
        b.find(".js-string").remove();
        d = b.find(".media");
        e = d.find("embed");
        g = d.find("object");
        h = d.find("iframe");
        i = d.html();
        j = /src="?http(s)?:\/\/(www)?.youtube(-nocookie)?.com/i.test(i);
        k = /src="?http:\/\/player\.vimeo\.com/i.test(i);
        if (j) {
            l = i.match(/http(s)?:\/\/(www)?.youtube(-nocookie)?.com\/([a-zA-Z0-9\/\-_])+/i)[0];
            m = l.match(/\/([ev]|embed)\/([a-zA-Z0-9\/\-_]+)/);
            n = Math.floor(vidWidth * .5625);
            o = Math.floor(vidWidth * .5625);
            a.getJSON("http://gdata.youtube.com/feeds/api/videos/" + m[2] + "?v=2&alt=json-in-script&callback=?", function(a) {
                var b;
                if (a.entry.media$group.yt$aspectRatio != null) {
                    b = o;
                } else {
                    b = n;
                }
                
                if (jInit==null){
                	d.html('<iframe src="' + h.attr("src") + '?&theme=light&title=0&byline=0&portrait=0&color=" width="' + vidWidth + '" height="' + b + '" frameborder="0"  allowfullscreen></iframe>');
                	jInit==true;
                	console.log("yooooo");
                	}else{
                	d.html('<iframe src="' + h.attr("src") + '?&theme=light" width="' + vidWidth + '" height="' + b + '" frameborder="0"  allowfullscreen></iframe>');}	
            });
        } else {
            if (k) {
                d.html('<iframe src="' + h.attr("src") + "?&title=0&byline=0&portrait=0&color=" + '" width="' + vidWidth + '" height="' + c(h, "attr") + '" frameborder="0" ></iframe>');
            } else {
                if (h.length > 0) {
                    p = c(h, "attr");
                    h.attr("width", vidWidth).attr("height", p).css("width", vidWidth).css("height", p);
                } else {
                    if (e.length > 0) {
                        p = c(e, "css");
                        e.attr("wmode", "opaque").wrap("<div></div>");
                        e.css("width", vidWidth).css("height", p);
                        e.parent().css("width", vidWidth).css("height", p);
                        if (e.parent().parent().is("object")) {
                            e.parent().parent().css("width", vidWidth).css("height", p);
                        }
                    } else {
                        if (g.length > 0 && g.not(":has(embed)")) {
                            if (!a.support.htmlSerialize) {
                                g.replaceWith(g.attr("altHtml"));
                                e = d.find("embed");
                                p = c(e, "css");
                                e.css("width", vidWidth).css("height", p);
                                e.attr("wmode", "opaque");
                            } else {
                                p = c(g, "attr");
                                g.css("width", vidWidth).css("height", p).attr("width", vidWidth).attr("height", p);
                            }
                        }
                    }
                }
            }
        }
        d.removeClass("loading");
    }
    a(document).ready(function() {
        var c, d, h;
        function e(a) {
            a.find(".post_info_overlay").fadeIn(300);
            a.addClass("clicked");
        }
        function g(a) {
            a.find(".post_info_overlay").fadeOut(300);
            a.removeClass("clicked");
        }
        function j() {
            $("#post_permalink").css({
                width: widthRef,
                height: heightRef - 64
            });
            $(".perma .post_relative img").css({
                "max-width": widthRef - 200,
                "max-height": heightRef - 200
            });
            $("#post_notes").fadeIn(400);
        }
        
        c = false;
        d = false;
        heightRef = $(window).height();
        widthRef = $(window).width();
        tag_searchVal = $(".tag_search").attr("value");
        $("head").append("<style>.perma .post_relative img {max-width:" + (widthRef - 200) + "px;max-height:" + (heightRef - 200) + "px}#lightbox_image img{max-width:" + widthRef + "px;max-height:" + heightRef + "px}</style>");
        $(".nav_button_description").click(function() {
            $(".description_overlay_wrapper").show(0);
        });
        $(".description_overlay_wrapper").click(function() {
            $(this).hide(0);
        });
        $(".description_overlay_wrapper a").click(function(a) {
            a.stopPropagation();
        });
        $(".desktop .post_options_more_info").live("click", function() {
        	var permaURL = $(this).siblings(".post_options_permalink").attr("href");
        	var titleHeight = $(this).parent().siblings(".post_info_overlay").find(".post_info_overlay_headline");
			    var txt = titleHeight.text();
			    if (txt.length>100) {
			        titleHeight.html(txt.substring(0,115)+' - <a href="'+permaURL+'"> (Continued)</a>');
			        titleHeight.removeClass("post_info_overlay_headline").addClass("shortened_headline")
			    }
			var f, b = window.pageYOffset, d = $(this).parent().parent().height();
            if (c == false) {
                f = (heightRef - d) / -2;
            } else {
                f = (heightRef - d - 64) / -2;
            }
            $("body").scrollTo(this, 400, {
                offset: f
            });
            g($(".clicked"));
            e($(this).parent().parent());
        });
        $(".notes_scroll_down").live("click", function() {
            $("body").scrollTo({
                top: heightRef,
                left: "0"
            }, 200);
        });
        $("#post_permalink_inner,.notes_scroll_to_top").live("click", function() {
            $("body").scrollTo({
                top: "0",
                left: "0"
            }, 200);
        });
        $(".index.desktop .post_relative").live("click", function() {
            var e, b = window.pageYOffset, d = $(this).parent().height();
            if (c == false) {
                e = (heightRef - d) / -2;
            } else {
                e = (heightRef - d - 64) / -2;
            }
            $("body").scrollTo(this, 400, {
                offset: e
            });
        });
        $(".desktop #posts, .desktop .post_info_overlay_cell").live("click", function(a) {
            if ($(a.target).is("#posts") || $(a.target).is(".post_info_overlay_cell")) {
                g($(".clicked"));
            }
        });
        $(".index.desktop .post_relative .notPhotoset, .perma .post_relative .notPhotoset").live("click", function() {
            var b = $("#lightbox"), c = $(this).clone();
            b.toggle();
            b.animate({
                opacity: "1"
            }, 0);
            b.find("#lightbox_image").append(c);
            $("#lightbox_image img").css({
                "max-width": widthRef,
                "max-height": heightRef
            });
        });
        $("#lightbox").click(function() {
            $(this).css({
                opacity: "0"
            });
            $(this).toggle();
            $(this).find("img").remove();
        });
        h = $("input[type=text], textarea");
        $(".type_like.post_info_overlay_button").live("click", function() {
            var a, b, c, d;
            $(this).removeClass("type_like").addClass("type_liked").addClass("liked").text("Liked");
            a = $(this).closest(".post");
            b = a.attr("id").slice(-11);
            c = a.children("input").attr("value").slice(-8);
            d = "http://www.tumblr.com/like/" + c + "?id=" + b;
            $("#likeit").attr("src", d);
        });
        $(".type_like.post_options_like").live("click", function() {
            var a, b, c, d;
            $(this).removeClass("type_like").addClass("type_liked").removeClass("post_options_like").addClass("post_options_liked");
            a = $(this).closest(".post");
            b = a.attr("id").slice(-11);
            c = a.children("input").attr("value").slice(-8);
            d = "http://www.tumblr.com/like/" + c + "?id=" + b;
            $("#likeit").attr("src", d);
        });
        $(".post_options_reblog, .post_options_like, .post_options_permalink").live("click", function(a) {
            a.stopPropagation();
        });
        $(".back_to_top").live("click", function() {
            $("body").scrollTo({
                top: "0",
                left: "0"
            }, 300);
        });
        $(".index #tumblr_controls").css({
            position: "fixed",
            top: "auto",
            bottom: "0",
            right: "30px",
            padding: "20px",
            zIndex: "1000007"
        });
        if(tumblr_show==true){$(".index #tumblr_controls").css("display", "block")}
        else{$(".index #tumblr_controls").css("display", "none")}
        if ($(".post_text_perma").length > 0) {
            if ($(".post_text_perma").height() > heightRef) {
                $("#tumblr_controls").css("position", "fixed");
                $(".notes_scroll_down").remove();
                $("#pagination_permalink").css("position", "fixed");
            } else {
                $(".post_text_perma").css("min-height", heightRef - 64);
            }
            $(".label").each(function() {
                $(this).text($(this).text().replace(':',' -'));
            });
        }
        $("#nav_toggle").live({
            mouseenter: function() {
                if (c == false) {
                    $(".tag_search").attr("value", "/Open menu");
                }
            },
            mouseleave: function() {
                if (c == false) {
                    $(".tag_search").attr("value", tag_searchVal);
                }
            }
        });
        $(".tag_search").live({
            mouseenter: function() {
                if (c == false && infiniteScroll == true) {
                    $(this).attr("value", "/Search tags").toggleClass("tag_search_hover");
                }
            },
            mouseleave: function() {
                if (c == false && infiniteScroll == true) {
                    $(this).attr("value", tag_searchVal).toggleClass("tag_search_hover");
                }
            }
        });
        $("#nav_toggle").click(function() {
            doNav();
        });
        h.focus(function(a) {
            if (c == false && infiniteScroll == true) {
                openNav();
            }
            if (a.target.value == a.target.defaultValue) {
                a.target.value = "";
            }
        });
        $(".post_table_cell_perma img,.post_table_cell_perma iframe").each(function() {
            $(this).parent().css({
                "text-align": "center",
/*                 "border-top": "dotted 1px #666666", */
/*                 "border-bottom": "dotted 1px #666666", */
                "padding-top": "19px",
                "padding-bottom": "19px",
                "margin-top": "36px",
                "margin-bottom": "36px"
            });
        });
        h.blur(function(a) {
            if (a.target.value == "") {
                a.target.value = a.target.defaultValue;
            }
        });
        doNav = function() {
            if (!IOS || !infiniteScroll) {
                if (c == false) {
                    openNav();
                } else {
                    closeNav();
                }
            }
        };
        closeNav = function() {
            if (!IOS || !infiniteScroll) {
                $("body").scrollTo({
                    top: "-=64px",
                    left: "+=0"
                }, 200);
                $("#navSwitch").css({
                    "-webkit-transform": "rotate(45deg)",
                    "-moz-transform": "rotate(45deg)",
                    "-o-transform": "rotate(45deg)",
                    "-ms-transform": "rotate(45deg)"
                });
                $("#nav").slideToggle(200);
                if(tumblr_show==false){$("#tumblr_controls").slideToggle(200)};
                c = false;
            }
        };
        openNav = function() {
            if (!IOS || !infiniteScroll) {
                $(".tag_search").attr("value", tag_searchVal);
                $(".tag_search").css("background-color", "transparent");
                $("body").scrollTo({
                    top: "+=64px",
                    left: "+=0"
                }, 200);
                $("#navSwitch").css({
                    "-webkit-transform": "rotate(0deg)",
                    "-moz-transform": "rotate(0deg)",
                    "-o-transform": "rotate(0deg)",
                    "-ms-transform": "rotate(0deg)"
                });
                $("#nav").slideToggle(200);
                if(tumblr_show == false){$("#tumblr_controls").slideToggle(200)};
                c = true;
           		}
        	};
        $("#posts").click(function() {
            if (c == true) {
                closeNav();
            }
        });
        permaNav = function() {
            $("#nav, #tumblr_controls").slideToggle(0);
        };
        j();
        $(window).resize(function() {
            heightRef = $(window).height();
            widthRef = $(window).width();
            j();
        });
        if ($("body").hasClass("perma")) {
            permaNav();
        }
        $(".desktop .post_relative").live({
            mouseenter: function() {
                var a = $(this), b = a.find(".post_options");
                if (a.is(":not(.clicked)") && antisocial == false) {
                    b.stop().animate({
                        width: "71px",
                        height: "71px"
                    }, 100);
                }
            },
            mouseleave: function() {
                var a = $(this), b = a.find(".post_options");
                b.stop().animate({
                    width: "0",
                    height: "0"
                }, 100);
            },
            click: function() {
                var a = $(this), b = a.find(".post_options");
                b.stop().animate({
                    width: "0",
                    height: "0"
                }, 100);
            }
        });
        $(".index.mobile .post").live({
            click: function() {
                location = $(this).find(".post_options_permalink").attr("href");
            }
        });
        $("#photoSetNudge a").click(function() {
            $(".photoset_photo").trigger("click");
        });
        albumCover = function() {
            $(".index .type_photoset").each(function() {
                var a = $(this), b = a.find("iframe");
                b.hide();
                b.load(function() {
                    var d, e, c = b.contents().find(".photoset").children(":first-child").children(":first-child");
                    c.children(":first-child").remove();
                    d = c.attr("href");// + "?" + Math.random() * 1;
                    c.append("<img src='" + d + "' alt='Cover Page' />");
                    e = c.find("img");
                    e.load(function() {
                        if (e.height() > photoSetH) {
                            e.height(photoSetH);
                        }
                    });
                    c.appendTo(a);
                });
            });
        };
        checkTitles = function(){
            $(".index .title_chat a").each(function() {
        		if($(this).text().length <1){
        			$(this).text("Chat Post");
        		}
        	})
            $(".index .title_text a").each(function() {
        		if($(this).text().length <1){
        			$(this).text("Text Post");
        		} else if($(this).text().length >80){
			    	var titleLength = $(this).text();
					$(this).html(titleLength.substring(0,115)+'... <br><span class="read_more">(Continued)</span>');
				    /* titleHeight.removeClass("post_info_overlay_headline").addClass("shortened_headline") */        		
        		}
        	})
            $(".index .title_quote a").each(function() {
        		if($(this).text().length <1){
        			$(this).text("Text Post");
        		} else if($(this).text().length >80){
			    	var titleLength = $(this).text();
					$(this).html(titleLength.substring(0,115)+'..." <br><span class="read_more">(Continued)</span>');
				    /* titleHeight.removeClass("post_info_overlay_headline").addClass("shortened_headline") */        		
        		}
        	})
        }
        musicCover = function() {
            $(".type_audio").each(function() {
                var a = $(this), b = a.find(".html_photoset");
                if ($(this).find("img").length == 0){
                $(this).find(".post_audio_no_art").html('<img src="'+ noartwork +'" alt=noart" />')
                }
            });
        };
        cleanUp = function() {
            albumCover();
            musicCover();
            checkTitles();
        };
        cleanUp();
        if (!IOS) {
            $("body").addClass("desktop");
        }
        if (window.location.href.indexOf("/page/") > -1 || IOS || window.location.href.indexOf("/post/") > -1) {
            infiniteScroll = false;
        }
        if (IOS == true) {
            $("body").addClass("mobile").removeClass("infscroll");
            $(".mobile.index .type_audio").each(function() {
                $(this).remove();
            });
            $("#nav,#tumblr_controls").css("display", "block");
            $("form, input, #nav_toggle,.nav_theme_credit, #nav_searchfield_background, .nav_button_spacer:first-child").remove();
            $(".nav_button_spacer:first-child").css("width", "10");
        }
        if (navDefault == true && !IOS) {
            $("body").removeClass("infscroll");
            $("#nav,#tumblr_controls").css("display", "block");
            $('.next.nav_button').css("display", "none");
        }
        if (!IOS && infiniteScroll == false) {
            $("#nav,#tumblr_controls").css("display", "block");
            $("#nav_toggle,.nav_theme_credit").remove();
            $("#nav_searchfield_background").css({
                "background-color": "transparent",
                width: "170px"
            });
            $(".tag_search").toggleClass("tag_search_hover");
        }
        b();
        if (infiniteScroll && !isPermalink) {
            a("#posts").infinitescroll({
                navSelector: "#infinite_scroll",
                nextSelector: "#infinite_scroll a.next",
                itemSelector: ".post",
                loadingImg: "http://static.tumblr.com/bfhsl6l/co0m1ywlq/infscroll_loader.gif",
                loadingText: "",
                donetext: ""
            }, function(c) {
                b(a(c), true);
                jInit=true;
                console.log("yo");
                cleanUp();
            });
        }
    });
})(window.jQuery);
