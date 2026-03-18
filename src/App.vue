<template>
  <v-layout>
    <v-theme-provider :theme="settings.themeLight ? 'light' : 'dark'">
      <v-app-bar density="compact">
        <v-app-bar-nav-icon variant="text" class="toggler" @click.stop="drawer = !drawer">
          &equiv;
        </v-app-bar-nav-icon>
        <v-toolbar-title class="ticker" v-if="news_ticker.length"> 
        <p>
          {{ news_ticker }}
        </p>
        </v-toolbar-title>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        temporary
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        class="pt-1"
      >
        <v-list>
          <v-list-item>
            <v-btn class="w-100"  
              @click="startMeteo" 
              :active="showMeteo"
              style="justify-content: start;"
            >
              {{ _t('Meteostation') }}
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn class="w-100" 
              @click="changeTheme()"
              style="justify-content: start;"
            >
             {{ _t(settings.themeLight ? 'Dark theme' : 'Light theme')}}
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn class="w-100" 
              @click="changeLanguage"
              style="justify-content: start;"
            >
             {{ settings.language === 'ru-RU' ? 'English' : 'Русский' }}
            </v-btn>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-btn class="w-100" @click="switchOff" style="justify-content: start;">
             {{ _t('Exit')}}
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-img :src="news_image" style="width:220px;margin-top:5px;">
            </v-img>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-card
        class="mx-auto text-center mt-12"
        :subtitle="_t('Updated at') + ' : ' + updated_at"
        style="width:-webkit-fill-available;" 
        v-if="showMeteo"
        :color="settings.themeLight ? '#e9eee6' : '#2c2e2b'"
      >
        <template v-slot:title>
          <span class="font-weight-black">{{ _t('Our meteostation') }}</span>
        </template>
        <v-card-text class="bg-surface-light pa-1">
        <div class="weather">
          <div v-if="true"> 
            <div class="d-flex flex-wrap" v-if="!chartMode">
              <div class="border-md flex-grow-1">
                <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                  <div class="temp-box">
                    <div class="link-icon-left chart-link" 
                      @click="showChart('temperature')" 
                      :title="_t('Show chart')"
                    >
                    </div>
                    <div class=" font-weight-medium">
                      {{ _t('Temperature') }}
                    </div>
                    <div class="wx-parameter">
                      {{ temperature_out }} 
                      <span class="text-unit">
                        {{ temperature_unit }}
                      </span>
                    </div>
                    <div class="">
                      {{ _t('Feels like') }}
                      <span class="text-green">
                        {{ feels_like }} {{ feels_like_unit }}
                      </span>
                    </div>
                  </div>
                  <div class="temp-box">
                    <div class="link-icon-left chart-link" 
                      @click="showChart('humidity')" 
                      :title="_t('Show chart')"
                    >
                    </div>
                    <div class=" font-weight-medium">
                      {{ _t('Humidity') }}
                    </div>
                    <div class="wx-parameter">
                      {{ humidity }} 
                      <span class="text-unit">
                        {{ humidity_unit }}
                      </span>
                    </div>
                    <div class="">
                      {{ _t('Dew point') }}
                      <span class="text-green">
                        {{ dew_point }} {{ dew_point_unit }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="border-md flex-grow-1">
                <div class="link-icon-left chart-link pt-l-4" 
                  @click="showChart('pressure')" 
                  :title="_t('Show chart')"
                >
                </div>
                <div class=" font-weight-medium">
                  {{ _t('Pressure') }} 
                </div>
                <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                  <div class="temp-box">
                    <div class="">
                      {{ _t('Absolute') }}
                    </div>
                    <div class="wx-parameter">
                      {{ pressure_abs }}
                      <span class="text-unit">
                        {{ pressure_unit }}
                      </span>
                    </div>
                  </div>
                  <div class="temp-box">
                    <div class="">
                      {{ _t('Relative') }}
                    </div>
                    <div class="wx-parameter">
                      {{ pressure_rel }}
                      <span class="text-unit">
                        {{ pressure_unit }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="border-md flex-grow-1">
                    <div class="link-icon-left chart-link pt-l-4" 
                      @click="showChart('solar')" 
                      :title="_t('Show chart')"
                    >
                    </div>
                <div class=" font-weight-medium">
                  {{ _t('Solar and UVI') }}
                </div>
                <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                  <div class="temp-box">
                    <div class="">
                      {{ _t('Illumination') }}
                    </div>
                    <div class="wx-parameter">
                      {{ solar_rounded.value }}
                      <span class="text-unit">
                        {{ solar_rounded.unit }}
                      </span>
                    </div>
                  </div>
                  <div class="temp-box">
                    <div class="">
                      {{ _t('UVI') }}
                    </div>
                    <div class="wx-parameter">
                      {{ uvi }}
                      <span class="text-unit">
                        {{ uvi_unit }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="border-md flex-grow-1">
                  <div class="link-icon-left chart-link pt-l-4" 
                    @click="showChart('wind')" 
                    :title="_t('Show chart')"
                  >
                  </div>
                <div class=" font-weight-medium">
                  {{ _t('Wind') }}
                </div>
                <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                  <div class="temp-box">
                    <div class="">
                      {{ _t('Speed') }}
                    </div>
                    <div class="wx-parameter">
                      {{ wind_speed }}
                      <span class="text-unit">
                        {{ wind_speed_unit }}
                      </span>
                    </div>
                  </div>
                  <div class="temp-box height130" v-if="!!wind_arrow_style">
                    <div class="wind-arrow" :style="wind_arrow_style"></div>
                    <div class="wx-parameter" style="position:relative;top:-100px;">
                      {{ wind_direction }}
                      <span class="text-unit">
                        {{ wind_direction_unit }}
                      </span>
                      <p class="wind-rumb">{{ wind_rumb }}</p>
                    </div>
                  </div>
                  <div class="temp-box">
                    <div class="">
                      {{ _t('Gust') }}
                    </div>
                    <div class="wx-parameter">
                      {{ wind_gust }}
                      <span class="text-unit">
                        {{ wind_speed_unit }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="border-md flex-grow-1">
                <div class="link-icon-left chart-link pt-l-4" 
                  @click="showChart('rainfall')" 
                  :title="_t('Show chart')"
                >
                </div>
                <div class=" font-weight-medium">
                  {{ _t('Rain') }}
                </div>
                <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                  <div class="temp-box">
                    <div class="">
                      {{ _t('Per hour') }}
                    </div>
                    <div class="wx-parameter">
                      {{ rain_hour }} 
                      <span class="text-unit">
                        {{ rain_unit }}
                      </span>
                    </div>
                    <div class="">
                      {{ _t('Per day') }}
                    </div>
                    <div class="wx-parameter">
                      {{ rain_day }} 
                      <span class="text-unit">
                        {{ rain_unit }}
                      </span>
                    </div>
                  </div>
                  <div class="temp-box align-content-center">
                    <div class="d-flex justify-space-around" style="height:2em;">
                      {{ _t('Weekly') }} <span class="text-green">
                        {{ rain_week }} {{ rain_unit }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-around" style="height:2em;">
                      {{ _t('Monthly') }} <span class="text-green">
                        {{ rain_month }} {{ rain_unit }}
                      </span>
                    </div>
                    <div class="d-flex justify-space-around" style="height:2em;">
                      {{ _t('Yearly') }} <span class="text-green">
                        {{ rain_year }} {{ rain_unit }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex flex-wrap" v-if="chartMode">
              <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                <v-btn density="default" @click="showChart(null)" :title="_t('Close')">&#65794;</v-btn>
                <LineChart :history="dataset" />
              </div>
            </div>
          </div>
        </div>
        </v-card-text>
      </v-card>
      <v-overlay
        :model-value="loader"
        class="align-center justify-center"
      >
        <v-progress-circular
          color="primary"
          size="64"
          indeterminate
        ></v-progress-circular>
    </v-overlay>
    </v-theme-provider>
  </v-layout>
</template>

<script lang="ts">
  import axios from "axios";
  import CONFIG from "./config.ts";
  import TRANSLATIONS from "./translations.ts";
  import moment from "moment/dist/moment";
  import LineChart from "./components/LineChart.vue";

  const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;

  const STORAGE = window.localStorage;


  const HISTORY_UPDATES_INTERVAL = 7200000;  //TODO 2 hours
  const WEATHER_UPDATES_INTERVAL = CONFIG.weatherUpdatesInterval;  //TODO 5 minutes

  const  onDeviceReady = () => {}

  document.addEventListener("deviceready", onDeviceReady, false);

  export default {
    name: "App",
    components: { LineChart },
    data() {
      return {
        wxData: null,
        historyData: null,
        timer: '',
        updated_at: "",
        showMeteo: false,
        sidebar: false,
        chartMode: false,
        dataset: null,
        settings: {
          themeLight: false,
          language: 'en-US'
        },
        drawer: false,
        news_ticker: '',
        news_image: null,
        loader: false
      }
    },
    async mounted() {
      this.updateSettings();
      this.setLanguage();
      this.startMeteo();
      this.getNews();
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    methods: {
      async getWxData() {
        this.loader = true;
          try {
            const response = await axios(CONFIG.weatherUrl);
            this.wxData = response.data.all.data;
            this.updated_at = new Date().toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
            this.updateHistory(response.data.history);
          } catch (error) {
            console.error(this._t('Error fetching weather data:'), error);
          }
          this.loader = false;
      },
      async getNews() {
        try {
          const response = await axios.post(CONFIG.newsUrl);
          let stickers, firstSticker, firstAttachment;
          stickers = response?.data?.active_stickers;
          firstSticker = stickers[0];
          this.news_ticker = firstSticker?.message;
          let attachments = firstSticker.attachments;
          this.news_image = attachments[0]?.media?.path;
          if (this.news_image.length) {
            this.news_image = this.news_image.replace('public', CONFIG.imgUrlReplacementString);
          }
        } catch (error) {
          console.error(this._t('Error fetching data:'), error);
        }
      },
      updateHistory(payload) {
        this.historyData = JSON.parse(STORAGE.getItem('history'));
        if (!this.history_is_ready) {
          this.historyData = payload?.data;
          this.historyData.updated_at = Date.now();
          STORAGE.setItem('history', JSON.stringify(this.historyData));
        }
      },
      setLanguage() {
        if (this.settings.language.length > 1) {
          document.documentElement.setAttribute('lang', this.settings.language.slice(0, 2));
        }
      },
      changeLanguage() {
        let current = this.settings.language.slice(0, 2).toLowerCase();
        if (current === 'en') {
          this.settings.language = 'ru-RU';
        }
        if (current === 'ru') {
          this.settings.language = 'en-US';
        }
        this.saveSettings();
        this.setLanguage();
      },
      changeTheme() {
        this.settings.themeLight = !this.settings.themeLight;
        this.saveSettings();
      },
      updateSettings() {
        const savedSettings = JSON.parse(STORAGE.getItem("localSettings"));
        Object.keys(this.settings).map((key, index) => {
          if (typeof savedSettings[key] !== 'undefined') {
            this.settings[key] = savedSettings[key];
          }
        });
      },
      _t(txt) {
        let current = TRANSLATIONS[this.settings.language];
        if (typeof current !== 'undefined') {
          return current[txt] ?? txt;
        }
        return txt;
      },
      startMeteo() {
        this.showMeteo = !this.showMeteo;
        if (!this.showMeteo) {
          clearInterval(this.timer);
        } else {
          this.getWxData();
          this.timer = setInterval(this.getWxData, 300000);
          this.drawer = false;
        }
        this.showChart(null);
      },
      showChart(wx_param) {
        if (wx_param === null) {
          this.chartMode = false;
        } else {
          switch (wx_param) {
            case 'temperature' :
              this.dataset = this.temperature_history;
              break;
            case "humidity":
              this.dataset = this.humidity_history;
              break;
            case "pressure":
              this.dataset = this.pressure_history;
              break;
            case "solar":
              this.dataset = this.solar_history;
              break;
            case "wind":
              this.dataset = this.wind_history;
              break;
            case "rainfall":
              this.dataset = this.rainfall_history;
              break;
            default:
              this.dataset = this.temperature_history;
          }
          this.chartMode = true;
        }
      },
      saveSettings() {
        STORAGE.setItem("localSettings", JSON.stringify(this.settings));
      },
      switchOff() {
        if(!!navigator.app) {
          navigator.app.exitApp();
        } else {
          setTimeout(() => {
            let ww = window.open(window.location, '_self'); 
            ww.close(); 
          }, 300);
        }
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
      history_is_ready() {
        if (this.historyData === null || this.historyData.updted_at === undefined) {
          return false;
        }
        if (this.historyData.updated_at === null) {
          return false;
        }
        let currentTimestamp = Date.now();
        if (currentTimestamp - this.historyData.updated_at > HISTORY_UPDATES_INTERVAL) {
          return false;
        }
        return true;
      },
      temperature_history() {
        let temperatureHistory = this.historyData?.outdoor?.temperature?.list;
        let labels = [];
        let temperatureDataset = [];
        Object.keys(temperatureHistory).forEach(key => {
          if (!isNaN(key)) {
            labels.push(moment.unix(key).format("DD.MM"))
            temperatureDataset.push(parseFloat(temperatureHistory[key]));
          }
        });
        return {
          'labels':labels,
          'datasets': [
            {
              data:temperatureDataset,
              label: this._t('Temperature') + ', ' + this._t('℃'),  
              borderColor: 'rgb(141, 172, 45)', 
              backgroundColor: 'rgba(141, 172, 45, 0.3)',
              pointRadius: 3
            }
          ]
        };
      },
      humidity_history() {
        let humidityHistory = this.historyData?.outdoor?.humidity?.list;
        let labels = [];
        let humidityDataset = [];
        Object.keys(humidityHistory).forEach(key => {
          if (!isNaN(key)) {
            labels.push(moment.unix(key).format("DD.MM"))
            humidityDataset.push(parseFloat(humidityHistory[key]));
          }
        });
        return {
          'labels':labels,
          'datasets': [
            {
              data:humidityDataset,
              label: this._t('Humidity')  + ', ' + this._t('%'), 
              borderColor: 'rgb(141, 172, 45)', 
              backgroundColor: 'rgba(141, 172, 45, 0.3)',
              pointRadius: 3
            }
          ]
        };
      },
      pressure_history() {
        let pressureHistory = this.historyData?.pressure?.absolute?.list;
        let labels = [];
        let pressureDataset = [];
        Object.keys(pressureHistory).forEach(key => {
          if (!isNaN(key)) {
            labels.push(moment.unix(key).format("DD.MM"))
            pressureDataset.push(parseFloat(pressureHistory[key]));
          }
        });
        return {
          'labels':labels,
          'datasets': [
            {
              data:pressureDataset,
              label: this._t('Pressure') + ', ' + this._t('mmHg'), 
              borderColor: 'rgb(141, 172, 45)', 
              backgroundColor: 'rgba(141, 172, 45, 0.3)',
              pointRadius: 3
            }
          ]
        };
      },
      wind_history() {
        let windHistory = this.historyData?.wind?.wind_speed?.list;
        let labels = [];
        let windDataset = [];
        Object.keys(windHistory).forEach(key => {
          if (!isNaN(key)) {
            labels.push(moment.unix(key).format("DD.MM"))
            windDataset.push(parseFloat(windHistory[key]));
          }
        });
        return {
          'labels':labels,
          'datasets': [
            {
              data:windDataset,
              label: this._t('Wind') + ', ' + this._t('m/s'), 
              borderColor: 'rgb(141, 172, 45)', 
              backgroundColor: 'rgba(141, 172, 45, 0.3)',
              pointRadius: 3
            }
          ]
        };
      },
      rainfall_history() {
        let rainfallHistory = this.historyData?.rainfall?.event?.list;
        let labels = [];
        let rainfallDataset = [];
        Object.keys(rainfallHistory).forEach(key => {
          if (!isNaN(key)) {
            labels.push(moment.unix(key).format("DD.MM"))
            rainfallDataset.push(parseFloat(rainfallHistory[key]));
          }
        });
        return {
          'labels':labels,
          'datasets': [
            {
              data:rainfallDataset,
              label: this._t('Rain') + ', ' + this._t('mm'),  
              borderColor: 'rgb(141, 172, 45)', 
              backgroundColor: 'rgba(141, 172, 45, 0.3)',
              pointRadius: 3
            }
          ]
        };
      },
      solar_history() {
        let solarHistory = this.historyData?.solar_and_uvi?.solar?.list;
        let labels = [];
        let solarDataset = [];
        Object.keys(solarHistory).forEach(key => {
          if (!isNaN(key)) {
            if (moment.unix(key).hour() === 15) {
              labels.push(moment.unix(key).format("DD.MM"))
              solarDataset.push(parseFloat(solarHistory[key]));
            }
          }
        });
        return {
          'labels':labels,
          'datasets': [
            {
              data:solarDataset,
              label: this._t('Illumination') + ', ' + this._t('lx'), 
              borderColor: 'rgb(141, 172, 45)', 
              backgroundColor: 'rgba(141, 172, 45, 0.3)',
              pointRadius: 3
            }
          ]
        }
      },
      drawerStyle() {
        if(this.drawer) {
          return this.$vuetify.display.mobile ? 
            'width:100%;transform:translateX(-100%)' : 
            'width:360px;transform:translateX(-360px)';
        } else {
          return this.$vuetify.display.mobile ? 
            'width:100%;transform:translateX(0%)' : 
            'width:360px;transform:translateX(-1px)';
        }
      }
    },
    watch: {
      "showMeteo"() {
        if(this.drawer) {
          this.drawer = false;
        }
      },
      "settings.themeLight"() {
        if(this.drawer) {
          this.drawer = false;
        }
      },
      "settings.language"() {
        if(this.drawer) {
          this.drawer = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>
