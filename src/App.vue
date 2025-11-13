<template>
  <main class="main-section">
    <div class="weather" :style="toggler_style">
      <h2 @click="start">{{ _t('Our meteostation') }}</h2>
      <div v-if="show"> 
        {{ _t('Updated at') }} {{ updated_at_formatted }}
        <div class="wrapper">
          <div class="params_block_wrapper">
            <div class="params_block">
              <div class="temp-box">
                <div class="text-small text-white text-bolder">
                  {{ _t('Temperature') }}
                </div>
                <div class="wx_parameter">
                  {{ temperature_out }} 
                  <span class="text-unit">
                    {{ temperature_unit }}
                  </span>
                </div>
                <div class="text-small">
                  {{ _t('Feels like') }}
                  <span class="text-green">
                    {{ feels_like }} {{ feels_like_unit }}
                  </span>
                </div>
              </div>
              <div class="temp-box">
                <div class="text-small text-white text-bolder">
                  {{ _t('Humidity') }}
                </div>
                <div class="wx_parameter">
                  {{ humidity }} 
                  <span class="text-unit">
                    {{ humidity_unit }}
                  </span>
                </div>
                <div class="text-small">
                  {{ _t('Dew point') }}
                  <span class="text-green">
                    {{ dew_point }} {{ dew_point_unit }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="params_block_wrapper">
            <div class="text-small text-white text-bolder">
              {{ _t('Pressure') }} 
            </div>
            <div class="params_block">
              <div class="temp-box">
                <div class="text-small">
                  {{ _t('Absolute') }}
                </div>
                <div class="wx_parameter">
                  {{ pressure_abs }}
                  <span class="text-unit">
                    {{ pressure_unit }}
                  </span>
                </div>
              </div>
              <div class="temp-box">
                <div class="text-small">
                  {{ _t('Relative') }}
                </div>
                <div class="wx_parameter">
                  {{ pressure_rel }}
                  <span class="text-unit">
                    {{ pressure_unit }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="params_block_wrapper">
            <div class="text-small text-white text-bolder">
              {{ _t('Solar and UVI') }}
            </div>
            <div class="params_block">
              <div class="temp-box">
                <div class="text-small">
                  {{ _t('Illumination') }}
                </div>
                <div class="wx_parameter">
                  {{ solar_rounded.value }}
                  <span class="text-unit">
                    {{ solar_rounded.unit }}
                  </span>
                </div>
              </div>
              <div class="temp-box">
                <div class="text-small">
                  {{ _t('UVI') }}
                </div>
                <div class="wx_parameter">
                  {{ uvi }}
                  <span class="text-unit">
                    {{ uvi_unit }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="params_block_wrapper">
            <div class="text-small text-white text-bolder">
              {{ _t('Wind') }}
            </div>
            <div class="params_block">
              <div class="temp-box">
                <div class="text-small">
                  {{ _t('Speed') }}
                </div>
                <div class="wx_parameter">
                  {{ wind_speed }}
                  <span class="text-unit">
                    {{ wind_speed_unit }}
                  </span>
                </div>
              </div>
              <div class="temp-box height130" v-if="!!wind_arrow_style">
                <div class="wind-arrow" :style="wind_arrow_style"></div>
                <div class="wx_parameter" style="position:relative;top:-100px;">
                  {{ wind_direction }}
                  <span class="text-unit">
                    {{ wind_direction_unit }}
                  </span>
                  <p class="wind-rumb">{{ wind_rumb }}</p>
                </div>
              </div>
              <div class="temp-box">
                <div class="text-small">
                  {{ _t('Gust') }}
                </div>
                <div class="wx_parameter">
                  {{ wind_gust }}
                  <span class="text-unit">
                    {{ wind_speed_unit }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="params_block_wrapper">
            <div class="text-small text-white text-bolder">
              {{ _t('Rain') }}
            </div>
            <div class="params_block">
              <div class="temp-box">
                <div class="text-small">
                  {{ _t('Per hour') }}
                </div>
                <div class="wx_parameter">
                  {{ rain_hour }} 
                  <span class="text-unit">
                    {{ rain_unit }}
                  </span>
                </div>
                <div class="text-small">
                  {{ _t('Per day') }}
                </div>
                <div class="wx_parameter">
                  {{ rain_day }} 
                  <span class="text-unit">
                    {{ rain_unit }}
                  </span>
                </div>
              </div>
              <div class="temp-box align-center">
                <div class="text-small space-between ml20 ml20">
                  {{ _t('Event') }}
                   <span class="text-green">
                    {{ rain_event }} {{ rain_unit }}
                  </span>
                </div>
                <div class="text-small space-between ml20">
                  {{ _t('Hourly') }} <span class="text-green">
                    {{ rain_hour }} {{ rain_unit }}
                  </span>
                </div>
                <div class="text-small space-between ml20">
                  {{ _t('Weekly') }} <span class="text-green">
                    {{ rain_week }} {{ rain_unit }}
                  </span>
                </div>
                <div class="text-small space-between ml20">
                  {{ _t('Monthly') }} <span class="text-green">
                    {{ rain_month }} {{ rain_unit }}
                  </span>
                </div>
                <div class="text-small space-between ml20">
                  {{ _t('Yearly') }} <span class="text-green">
                    {{ rain_year }} {{ rain_unit }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
  import axios from "axios";
  import REQUEST_PARAMS from "./request_params.ts";
  import TRANSLATIONS from "./translations.ts";

export default {
  name: "App",
  data() {
    return {
      wxData: null,
      language: 'en-US',
      timer: '',
      updated_at: "",
      show: false
    };
  },
  mounted() {
    this.language = window.navigator.language;
/*    this.getWxData();
    this.timer = setInterval(this.getWxData, 300000);*/
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async getWxData() {
      try {
        const response = await axios(REQUEST_PARAMS);
        this.wxData = response.data.data;
        this.updated_at = new Date().toLocaleTimeString();
      } catch (error) {
        console.error(this._t('Error fetching weather data:'), error);
      }
    },
    _t(txt) {
      let current = TRANSLATIONS[this.language];
      if (typeof current !== 'undefined') {
        return current[txt] ?? txt;
      }
      return txt;
    },
    start() {
      if (this.show) {
        clearInterval(this.timer);
      } else {
        this.getWxData();
        this.timer = setInterval(this.getWxData, 300000);
      }
      this.show = !this.show;  
    } 
  },
  computed: {
    temperature_out() {
      return this.wxData?.outdoor?.temperature?.value ?? null;
    },
    temperature_unit() {
      return this.temperature_out !== null ? 
        this._t(this.wxData?.outdoor?.temperature?.unit) : 
        null;
    },
    pressure_abs() {
      return this.wxData?.pressure?.absolute?.value ?? null;
    },
    pressure_rel() {
      return this.wxData?.pressure?.relative?.value ?? null;
    },
    pressure_unit() {
      return this.pressure_abs !== null ? 
        this._t(this.wxData?.pressure?.absolute?.unit) : 
        null;
    },
    humidity() {
      return this.wxData?.outdoor?.humidity?.value ?? null;
    },
    humidity_unit() {
      return this.humidity !== null ? 
        this._t(this.wxData?.outdoor?.humidity?.unit) : 
        null;
    },
    rain_hour() {
      return this.wxData?.rainfall['1_hour']?.value ?? null;
    },
    rain_day() {
      return this.wxData?.rainfall?.daily?.value ?? null;
    },
    rain_event() {
      return this.wxData?.rainfall?.event?.value ?? null;
    },
    rain_week() {
      return this.wxData?.rainfall?.weekly?.value ?? null;
    },
    rain_month() {
      return this.wxData?.rainfall?.monthly?.value ?? null;
    },
    rain_year() {
      return this.wxData?.rainfall?.yearly?.value ?? null;
    },
    rain_unit() {
      return this._t(this.wxData?.rainfall?.daily?.unit ?? null);
    },
    wind_direction() {
      return this.wxData?.wind?.wind_direction?.value ?? null;
    },
    wind_gust() {
      return this.wxData?.wind?.wind_gust?.value ?? null;
    },
    wind_speed() {
      return this.wxData?.wind?.wind_speed?.value ?? null;
    },
    wind_direction_unit() {
      return this.wind_direction !== null ? 
        this._t(this.wxData?.wind?.wind_direction?.unit) : 
        null;
    },
    wind_speed_unit() {
      return this.wind_speed !== null ? 
        this._t(this.wxData?.wind?.wind_speed?.unit) : 
        null;
    },
    wind_arrow_style() {
      if (Boolean(this.wind_speed * 1) || Boolean(this.wind_gust * 1)) {
        return 'transform:rotate(' + this.wind_direction + 'deg)';
      }
      return null;
    },
    solar() {
      return this.wxData?.solar_and_uvi?.solar?.value ?? null;
    },
    solar_unit() {
      return this.solar !== null ? 
        this._t(this.wxData?.solar_and_uvi?.solar?.unit) : 
        null;
    },
    uvi() {
      return this.wxData?.solar_and_uvi?.uvi?.value ?? null;
    },
    uvi_unit() {
      return this.uvi !== null ? 
        this._t(this.wxData?.solar_and_uvi?.uvi?.unit) : 
        null;
    },
    dew_point() {
      return this.wxData?.outdoor?.dew_point?.value ?? null;
    },
    dew_point_unit() {
      return this.dew_point !== null ? 
        this._t(this.wxData?.outdoor?.dew_point?.unit) : 
        null;
    },
    feels_like() {
      return this.wxData?.outdoor?.feels_like?.value ?? null;
    },
    feels_like_unit() {
      return this.feels_like !== null ? 
        this._t(this.wxData?.outdoor?.feels_like?.unit) : 
        null;
    },
    solar_rounded() {
      let result = {
        value: this.solar,
        unit: this.solar_unit
      };
      if (this.solar > 5000) {
        result.value = (Math.round(this.solar / 100) / 10),
        result.unit = 'K' + this.solar_unit;
      }
      return result;
    },
    wind_rumb() {
      if (isNaN(this.wind_direction)) {
        return "";
      }
      let rumb = (this.wind_direction / 1) + 11.25;
      if (rumb > 360) {
        rumb = rumb - 360;
      }
      let rumbs = {
        0 :'N', 
        1 : 'NNE', 
        2 : 'NE', 
        3 : 'ENE', 
        4 : 'E', 
        5 : 'ESE', 
        6 : 'SE', 
        7 : 'SSE', 
        8 : 'S', 
        9 : 'SSW', 
        10 : 'SW', 
        11 : 'WSW', 
        12 : 'W', 
        13 : 'WNW', 
        14 : 'NW', 
        15 : 'NNW'
      };
      return rumbs[Math.floor(rumb / 22.5)];
    },
    updated_at_formatted() {
      if (!this.updated_at.length) {
        return this.updated_at;
      }
      return this.updated_at.slice(0, -3);
    },
    toggler_style() {
      if (!this.show) {
        return 'width: 270px;left: 50%;';
      } else {
        return '';
      }
    }
  }
}
</script>

<style scoped>

</style>
