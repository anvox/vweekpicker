/*global Vue*/

Vue.component('v-weekpicker', {
  template: '<div ref="container" id="weekpicker"><input ref="control" :class="cssClasses" :name="name" v-model="internal_value" :disabled="disabled"/></div>',
  props: {
    more_classes: {},
    name: {},
    attributes: {},
    value: {},
    disabled: {
      default: false,
    }
  },
  data: function(){
    var internal_value;
    var patt = new RegExp(/\d\d\d\d-[wW]\d/);
    if(this.value !== undefined && this.value !== null && this.value !== "" ){
      if(patt.test(this.value)){
        internal_value = this.value;
      }else{
        internal_value = this.format(this.value);
      }
    }else{
      internal_value = this.format(moment());
    }
    return {
      internal_value: internal_value,
    };
  },
  computed: {
    cssClasses: function(){
      return "form-control " + this.more_classes;
    },
    displayValue: function(){
      return this.format(this.value);
    },
  },
  methods: {
    format: function(date){
      var d = moment(date).add(1, 'd');
      var week_from = moment(date).add(1, 'd').startOf('week').add(-1, 'd');
      var week_til = moment(date).add(1, 'd').startOf('week').add(5, 'd');
      return d.format("YYYY-[W]W")+ " (" + week_from.format("D/M") + "-" + week_til.format("D/M") + ")";
    },
    format2: function(date){
      var year = Number(date.split("-W")[0]);
      var week = Number(date.split("-W")[1].split(" ")[0]);
      var d = moment().day("Monday").year(year).week(week);

      return this.format(d);
    }
  },
  mounted: function(){
    $(this.$refs.control).data($(this.$refs.container).data());

    if(this.attributes !== undefined){
      for (var i = this.attributes.length - 1; i >= 0; i--) {
        $(this.$el).find('input').attr(this.attributes[i].name, this.attributes[i].value);
      }
    }

    $(this.$el).find("input").datepicker({
      format: {
        toDisplay: function(date) {
          var d = moment(date).add(1, 'd');
          var week_from = moment(date).add(1, 'd').startOf('week').add(-1, 'd');
          var week_til = moment(date).add(1, 'd').startOf('week').add(5, 'd');
          return d.format("YYYY-[W]W")+ " (" + week_from.format("D/M") + "-" + week_til.format("D/M") + ")";
        },

        toValue: function(date) {
          var year = Number(date.split("-W")[0]);
          var week = Number(date.split("-W")[1].split(" ")[0]);
          var d = moment().day("Monday").year(year).week(week).startOf('day');
          return d.toDate();
        }
      },
      container: '#weekpicker',
      autoclose: true,
      weekStart: 6
    });

    $(this.$el).find("input").on('show', function() {
      $('#weekpicker').find('.datepicker table tr').each(function() {
        if ($(this).find("td.day.active").length > 0) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
    });
    $(this.$el).find("input").on('keyup', function() {
      $('#weekpicker').find('.datepicker table tr').each(function() {
        if ($(this).find("td.day.active").length > 0) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
    });

    this.$emit('input', this.internal_value);
    $(this.$el).find("input").on('change', function() {
      this.internal_value = $(this.$el).find("input").val();
      this.$emit('input', this.internal_value);
    }.bind(this));
  },
  watch: {
    value: function(){
      this.$emit('input', this.internal_value);
    },
  }
});
