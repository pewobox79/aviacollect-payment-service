// Generated by CoffeeScript 1.4.0
(function() {

  (function($, window, document, undefined_) {
    var Plugin, defaults, pluginName;
    pluginName = 'tacky';
    defaults = {
      itemSelector: 'a',
      parentSelector: null,
      floating: false,
      tackedClass: 'tacked',
      activeClass: 'active',
      toggleClass: 'toggle',
      openClass: 'open',
      scrollSpeed: 500,
      scrollEasing: '',
      closeMenuSize: 700,
      markerOffset: .4
    };
    Plugin = function(element, options) {
      var _this = this;
      this.options = $.extend({}, defaults, options);
      this.$nav = $(element);
      this.$toggle_button = this.$nav.find("." + this.options.toggleClass);
      this.options.itemSelector += '[href^="#"]';
      this.init();
      return setTimeout((function() {
        return _this.init();
      }), 500);
    };
    Plugin.prototype = {
      init: function() {
        this._getDOMProperties();
        this._getPositions();
        return this._createEvents();
      },
      _getDOMProperties: function() {
        this._getElementSizes();
        return this._getNavOrigin();
      },
      _getElementSizes: function() {
        this.document_height = $(document).height();
        this.window_height = $(window).height();
        this.marker_offset = this.window_height * this.options.markerOffset;
        return this.nav_height = this.$nav.height();
      },
      _getNavOrigin: function() {
        var tackedClass;
        tackedClass = this.options.tackedClass;
        if (this.$nav.hasClass(tackedClass)) {
          if (this.$clone) {
            this.$clone.hide();
          }
          this.$nav.removeClass(tackedClass);
          this.nav_origin = this.$nav.offset().top;
          this.$nav.addClass(tackedClass);
          if (this.$clone) {
            return this.$clone.show();
          }
        } else {
          return this.nav_origin = this.$nav.offset().top;
        }
      },
      _getPositions: function() {
        var _this = this;
        this.links = this.$nav.find(this.options.itemSelector);
        this.targets = this.links.map(function() {
          return $(this).attr('href');
        });
        this.positions = [];
        return this.targets.each(function(i, target) {
          return _this.positions.push($(target).offset().top + 1);
        });
      },
      _createEvents: function() {
        var self,
          _this = this;
        $(document).off('scroll.tacky').on("scroll.tacky", function() {
          return _this._scroll();
        });
        $(window).off('scroll.tacky').on("resize.tacky", function() {
          return _this._resize();
        });
        self = this;
        this.links.off('click.tacky').on("click.tacky", function(evt, i) {
          evt.preventDefault();
          return self._scrollToTarget($(this).attr('href'));
        });
        return this.$toggle_button.off('click.tacky').on('click.tacky', function() {
          return _this._toggleOpen();
        });
      },
      _scroll: function() {
        var active_i, i, marker_position, nav_position, pos, scroll_position, _i, _len, _ref;
        scroll_position = $(document).scrollTop();
        active_i = null;
        if (scroll_position > this.nav_origin) {
          this._tackNav(true);
          nav_position = scroll_position + this.nav_height;
          if (nav_position >= this.positions[0] - 1) {
            marker_position = scroll_position + this.marker_offset;
            if (scroll_position + this.window_height === this.document_height) {
              marker_position = this.document_height;
            }
            _ref = this.positions;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              pos = _ref[i];
              if (marker_position >= pos) {
                active_i = i;
              }
            }
          }
        } else {
          this._tackNav(false);
        }
        if (active_i !== null) {
          return this._setActive(active_i);
        }
      },
      _tackNav: function(tacked) {
        if (tacked) {
          if (this.$nav.css('position') === 'static') {
            this.$clone = this.$nav.clone(false).insertBefore(this.$nav).css({
              visibility: 0
            });
          }
          return this.$nav.addClass(this.options.tackedClass);
        } else {
          this._clearActive();
          if (this.$clone) {
            this.$clone.remove();
          }
          return this.$nav.removeClass(this.options.tackedClass);
        }
      },
      _setActive: function(i) {
        var $active_item, parentSelector;
        if (i !== this.active_i) {
          this._clearActive();
          this.active_i = i;
          $active_item = this.links.eq(i);
          parentSelector = this.options.parentSelector;
          if (parentSelector) {
            return $active_item.closest(parentSelector).addClass(this.options.activeClass);
          } else {
            return $active_item.addClass(this.options.activeClass);
          }
        }
      },
      _clearActive: function() {
        var active_class;
        this.active_i = null;
        active_class = this.options.activeClass;
        return this.$nav.find('.' + active_class).removeClass(active_class);
      },
      _resize: function() {
        this._getDOMProperties();
        this._getPositions();
        this._scroll();
        return this._detoggle();
      },
      _scrollToTarget: function(target_id) {
        var openClass, position, position_index, scroll_speed;
        position_index = $.inArray(target_id, this.targets);
        position = this.positions[position_index];
        if (!this.options.floating) {
          position -= this.nav_height;
        }
        scroll_speed = this.$nav.hasClass(this.options.openClass) ? 0 : this.options.scrollSpeed;
        this._scrollTo(position, scroll_speed);
        openClass = this.options.openClass;
        if (this.$nav.hasClass(openClass)) {
          return this.$nav.removeClass(openClass);
        }
      },
      _scrollTo: function(position, speed) {
        return $("html, body").stop().animate({
          scrollTop: position
        }, speed, this.options.scrollEasing);
      },
      _toggleOpen: function() {
        var openClass, tackedClass;
        openClass = this.options.openClass;
        tackedClass = this.options.tackedClass;
        if (this.$nav.hasClass(openClass)) {
          return this.$nav.removeClass(openClass);
        } else {
          return this.$nav.addClass(openClass);
        }
      },
      _detoggle: function() {
        var closeMenuSize, document_width;
        closeMenuSize = this.options.closeMenuSize;
        if (closeMenuSize >= 0) {
          document_width = $(document).width();
          if (document_width >= closeMenuSize) {
            return this.$nav.removeClass(this.options.openClass);
          }
        }
      }
    };
    return $.fn[pluginName] = function(options) {
      var args, returns, scoped_name;
      args = arguments;
      scoped_name = "plugin_" + pluginName;
      if (options === undefined || typeof options === "object") {
        return this.each(function() {
          if (!$.data(this, scoped_name)) {
            return $.data(this, scoped_name, new Plugin(this, options));
          }
        });
      } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
        returns = void 0;
        this.each(function() {
          var instance;
          instance = $.data(this, scoped_name);
          if (instance instanceof Plugin && typeof instance[options] === "function") {
            returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
          }
          if (options === "destroy") {
            return $.data(this, scoped_name, null);
          }
        });
        if (returns !== undefined) {
          return returns;
        } else {
          return this;
        }
      }
    };
  })(jQuery, window, document);

}).call(this);
