<template>
  <v-layout class="flex-column">
    <v-theme-provider :theme="settings.themeLight ? 'light' : 'dark'">
      <v-app-bar density="compact" v-if="authorized">
        <v-app-bar-nav-icon variant="text" class="toggler" @click.stop="drawer = !drawer">
          &equiv;
        </v-app-bar-nav-icon>
        <v-toolbar-title class="ticker" v-if="news_ticker?.length"> 
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
        width="310"
      >
        <v-list>
          <v-list-item>
            <v-btn class="w-100"  
              @click="startMeteo" 
              style="justify-content: start;"
            >
              {{ showMeteo ? _t('Web camera') : _t('Meteostation') }}
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
        </v-list>
      </v-navigation-drawer>
      <v-card
        class="mx-auto text-center mt-12 rounded-0"
        :subtitle="_t('Updated at') + ' : ' + updated_at"
        style="width:-webkit-fill-available;" 
        v-if="showMeteo && authorized"
        :color="settings.themeLight ? '#e9eee6' : '#2c2e2b'"
      >
        <template v-slot:title>
          <span class="font-weight-black">{{ _t('Our meteostation') }}</span>
        </template>
        <v-card-text class="bg-surface-light pa-1">
        <div class="weather">
          <div> 
            <div class="d-flex flex-wrap" v-if="!chartMode">
              <div class="border-md flex-grow-1">
                <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                  <div class="temp-box">
                    <div class="link-icon-left chart-link" 
                      @click="showChart('temperature')" 
                      :title="_t('Show chart')"
                    >
                    </div>
                    <div class="font-weight-medium">
                      {{ _t('Temperature') }}
                    </div>
                    <div class="wx-parameter">
                      {{ temperature_out }} 
                      <span class="text-unit">
                        {{ temperature_unit }}
                      </span>
                    </div>
                    <div>
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
                    <div class="font-weight-medium">
                      {{ _t('Humidity') }}
                    </div>
                    <div class="wx-parameter">
                      {{ humidity }} 
                      <span class="text-unit">
                        {{ humidity_unit }}
                      </span>
                    </div>
                    <div>
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
                <div class="font-weight-medium">
                  {{ _t('Pressure') }} 
                </div>
                <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                  <div class="temp-box">
                    <div>
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
                    <div>
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
                <div class="font-weight-medium">
                  {{ _t('Solar and UVI') }}
                </div>
                <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                  <div class="temp-box">
                    <div>
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
                    <div>
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
                <div class="font-weight-medium">
                  {{ _t('Wind') }}
                </div>
                <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                  <div class="temp-box">
                    <div>
                      {{ _t('Speed') }}
                    </div>
                    <div class="wx-parameter">
                      {{ wind_speed }}
                      <span class="text-unit">
                        {{ wind_speed_unit }}
                      </span>
                    </div>
                    <div class="wind-gust-small">
                      {{ _t('Gust') }}
                      <span class="text-green">
                        {{ wind_gust }} {{ wind_speed_unit }}
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
                  <div class="temp-box wind-gust-large">
                    <div>
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
                <div class="font-weight-medium">
                  {{ _t('Rain') }}
                </div>
                <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                  <div class="temp-box">
                    <div>
                      {{ _t('Per hour') }}
                    </div>
                    <div class="wx-parameter">
                      {{ rain_hour }} 
                      <span class="text-unit">
                        {{ rain_unit }}
                      </span>
                    </div>
                    <div>
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
            <div class="d-flex flex-wrap" v-if="chartMode && authorized">
              <div class="d-flex flex-grow-1 flex-nowrap justify-space-between pa-1">
                <v-btn 
                  variant="plain"
                  size="large"
                  @click="showChart(null)" 
                  :title="_t('Close')" 
                  position="absolute" text="&#65794;"
                  style="font-size:2em;right:-24px;top:64px;"
                  >
                </v-btn>
                <LineChart :history="dataset" />
              </div>
            </div>
          </div>
        </div>
        </v-card-text>
      </v-card>
      <v-card v-if="!showMeteo && authorized" class="text-center mt-12">
        <iframe :src="videoSrc" 
          width="95%" height="600" 
          frameBorder="0" 
          seamless="seamless" 
          allowfullscreen
        >
          {{ _t('Your browser does not support frames') }} !
        </iframe>
      </v-card>

      <v-card v-if="!authorized">
        <div v-if="!onLine" class="pa-5">
          <v-card
            variant="elevated"
            class="mx-auto"
            :subtitle="_t('Please check internet connection and restart app')"
            :title="_t('Offline')"
          >
            <template v-slot:actions>
              <v-btn :text="_t('Close')" @click="switchOff"></v-btn>
            </template>
          </v-card>
        </div>
        <div v-else>
          <v-form @submit.prevent="register" class="mt-14 text-center">
            <p class="font-weight-black text-center">{{ _t('Application registration') }}</p>
            <v-text-field 
            :label="_t('Application key')"
              type="text"
              v-model="app_key"
              :error-messages="errors.app_key"
            >           
            </v-text-field>
            <v-btn class="mt-2" type="submit"> {{ _t('Register') }}</v-btn>
          </v-form>
          <p class="pa-6">
            {{ _t("This application is provided 'as is'. The developer is not liable for any direct or indirect damages arising from the use or inability to use this application. We do not guarantee that the application will function uninterrupted or error-free") }}. 
          </p>
        </div>
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
  const WEATHER_UPDATES_INTERVAL = CONFIG.weatherUpdatesInterval;

  const  onDeviceReady = () => {
    STORAGE.setItem('device', JSON.stringify(device));
  }
  document.addEventListener("deviceready", onDeviceReady, false);

  const findOrFail = (obj, path) => {
    if (isEmpty(obj) || !path.length) {
      return null;
    }
    let pathArr = path.split('.');
    for (let i=0; i < pathArr.length; i++ ) {
      if (typeof obj[pathArr[i]] === 'undefined') {
        return null;
      } else {
        obj = obj[pathArr[i]];
      }
    }
    return obj;      
  }

  export default {
    name: "GlobusMeteo",
    components: { LineChart },
    data() {
      return {
        wxData: null,
        historyData: null,
        timer: '',
        updated_at: "",
        showMeteo: false,
        chartMode: false,
        dataset: null,
        settings: {
          themeLight: false,
          language: 'en-US'
        },
        drawer: false,
        news_ticker: '',
        news_image: null,
        loader: false,
        videoSrc: CONFIG.liveCameraSrc,
        authorized: false,
        app_key: '',
        device: null,
        regData: {},
        errors: {},
        onLine: false
      }
    },
    async mounted() {
      this.updateSettings();
      this.setLanguage();
      this.onLine = window.navigator.onLine;
      if (this.onLine) {
        if(!this.authorized) {
          await this.auth();
        }
        if (this.authorized) {
          this.startMeteo();
          this.getNews();
        }
      }
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
          this.news_image = findOrFail(response, 'data.active_stickers.0.attachments.0.media.path');
          this.news_ticker = findOrFail(response, 'data.active_stickers.0.message');
          if (this.news_image?.length) {
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
        this.device = JSON.parse(STORAGE.getItem('device'));
        let savedSettings = JSON.parse(STORAGE.getItem("localSettings"));
        if (isEmpty(savedSettings)) {
          this.saveSettings();
          savedSettings = JSON.parse(STORAGE.getItem("localSettings"));
        }
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
      },
      async auth() {
        if (isEmpty(this.device)) {
          this.device = structuredClone(CONFIG.defaultDevice);
        }
        this.loader = true;
        try {
          this.log('auth');
          const response = await axios(CONFIG.regUrl + '/' + this.device.uuid + '/' + CONFIG.appId);
          this.regData = response.data?.regData;
        } catch (error) {
          console.error(this._t('Error fetching weather data:'), error);
        }
        this.loader = false;
        this.authorized = !isEmpty(this.regData?.customer);
      },
      async register() {
        if(!!this.app_key && this.device?.uuid) {
          try {
          this.log('register');
          this.errors = {};
          let url = CONFIG.regUrl + '/' + CONFIG.appId;
          let response = await axios.put(url, {
            app_key: this.app_key,
            device_uuid: this.device.uuid,
            device_serial: this.device.serial,
            app_id: CONFIG.appId
          });
          await this.auth();
          if (this.authorized) {
            this.startMeteo();
            this.getNews();
          }
        } catch(error)  {
          this.errors = findOrFail(error, 'response.data.errors');
        }
      }
     },
    log(action) {
      let data = Object.assign(this.device, {action: action, api_key: CONFIG.globusApiKey});
      axios.post(CONFIG.loggerUrl, data).then(r => {});
     }
    },
    computed: {
      temperature_out() {
        return findOrFail(this.wxData, 'outdoor.temperature.value');
      },
      temperature_unit() {
        return this.temperature_out !== null ? 
          this._t(findOrFail(this.wxData, 'outdoor.temperature.unit')) : 
          null;
      },
      pressure_abs() {
        return findOrFail(this.wxData, 'pressure.absolute.value');
      },
      pressure_rel() {
        return findOrFail(this.wxData, 'pressure.relative.value');
      },
      pressure_unit() {
        return this.pressure_abs !== null ? 
          this._t(findOrFail(this.wxData, 'pressure.absolute.unit')) : 
          null;
      },
      humidity() {
        return findOrFail(this.wxData, 'outdoor.humidity.value');
      },
      humidity_unit() {
        return this.humidity !== null ? 
          this._t(findOrFail(this.wxData, 'outdoor.humidity.unit')) : 
          null;
      },
      rain_hour() {
        return findOrFail(this.wxData, 'rainfall.1_hour.value');
      },
      rain_day() {
        return findOrFail(this.wxData, 'rainfall.daily.value');
      },
      rain_event() {
        return findOrFail(this.wxData, 'rainfall.event.value');
      },
      rain_week() {
        return findOrFail(this.wxData, 'rainfall.weekly.value');
      },
      rain_month() {
        return findOrFail(this.wxData, 'rainfall.monthly.value');
      },
      rain_year() {
        return findOrFail(this.wxData, 'rainfall.yearly.value');
      },
      rain_unit() {
        return this._t(findOrFail(this.wxData, 'rainfall.daily.unit'));
      },
      wind_direction() {
        return findOrFail(this.wxData, 'wind.wind_direction.value');
      },
      wind_gust() {
        return findOrFail(this.wxData, 'wind.wind_gust.value');
      },
      wind_speed() {
       return findOrFail(this.wxData, 'wind.wind_speed.value');
      },
      wind_direction_unit() {
        return this.wind_direction !== null ? 
          this._t(findOrFail(this.wxData, 'wind.wind_direction.unit')) : 
          null;
      },
      wind_speed_unit() {
        return this.wind_speed !== null ? 
          this._t(findOrFail(this.wxData, 'wind.wind_speed.unit')) : 
          null;
      },
      wind_arrow_style() {
        if (Boolean(this.wind_speed * 1) || Boolean(this.wind_gust * 1)) {
          return 'transform:rotate(' + this.wind_direction + 'deg)';
        }
        return null;
      },
      solar() {
        return findOrFail(this.wxData, 'solar_and_uvi.solar.value');
      },
      solar_unit() {
        return this.solar !== null ? 
          this._t(findOrFail(this.wxData, 'solar_and_uvi.solar.unit')) : 
          null;
      },
      uvi() {
        return findOrFail(this.wxData, 'solar_and_uvi.uvi.value');
      },
      uvi_unit() {
        return this.uvi !== null ? 
          this._t(findOrFail(this.wxData, 'solar_and_uvi.uvi.unit')) : 
          null;
      },
      dew_point() {
        return findOrFail(this.wxData, 'outdoor.dew_point.value');
      },
      dew_point_unit() {
        return this.dew_point !== null ? 
          this._t(findOrFail(this.wxData, 'outdoor.dew_point.unit')) : 
          null;
      },
      feels_like() {
        return findOrFail(this.wxData, 'outdoor.feels_like.value');
      },
      feels_like_unit() {
        return this.feels_like !== null ? 
          this._t(findOrFail(this.wxData, 'outdoor.feels_like.unit')) : 
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
        let temperatureHistory = findOrFail(this.historyData, 'outdoor.temperature.list');
        let labels = [];
        let temperatureDataset = [];
        Object.keys(temperatureHistory).forEach(key => {
          if (!isNaN(key)) {
            labels.push(moment.unix(key).format("DD.MM HH:mm"))
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
        let humidityHistory = findOrFail(this.historyData, 'outdoor.humidity.list');
        let labels = [];
        let humidityDataset = [];
        Object.keys(humidityHistory).forEach(key => {
          if (!isNaN(key)) {
            labels.push(moment.unix(key).format("DD.MM HH:mm"));
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
        let pressureHistory = findOrFail(this.historyData, 'pressure.absolute.list');
        let labels = [];
        let pressureDataset = [];
        Object.keys(pressureHistory).forEach(key => {
          if (!isNaN(key)) {
            labels.push(moment.unix(key).format("DD.MM HH:mm"));
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
        let windHistory = findOrFail(this.historyData, 'wind.wind_speed.list');
        let labels = [];
        let windDataset = [];
        Object.keys(windHistory).forEach(key => {
          if (!isNaN(key)) {
            labels.push(moment.unix(key).format("DD.MM HH:mm"));
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
        let rainfallHistory = findOrFail(this.historyData, 'rainfall.event.list');
        let labels = [];
        let rainfallDataset = [];
        Object.keys(rainfallHistory).forEach(key => {
          if (!isNaN(key)) {
            labels.push(moment.unix(key).format("DD.MM HH:mm"));
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
        let solarHistory = findOrFail(this.historyData, 'solar_and_uvi.solar.list');
        let labels = [];
        let solarDataset = [];
        Object.keys(solarHistory).forEach(key => {
          if (!isNaN(key)) {
            if (moment.unix(key).hour() === 15) {
              labels.push(moment.unix(key).format("DD.MM"));
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
