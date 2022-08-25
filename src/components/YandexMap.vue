<template>
  <yandex-map zoom="9"
              id="yandexMap"
              :coords="moscowCoords"
              @click="newMarker"
              @map-was-initialized="mapLoaded"
  >
    <ymap-marker marker-id="1" marker-type="Polygon" :coords="mkadCords"/>
  </yandex-map>
</template>

<script>

import { yandexMap, ymapMarker } from 'vue-yandex-maps';
import {findClosestTo} from "@/functions/findClosestTo";
import {mkadCoord} from "@/mkadCoords";

export default {
  created() {
    this.map = null;
    this.ymaps = null;
  },
  data() {
    return {
      settings: {
        apiKey: '186f0adf-8b02-43df-a8ae-8c25e6a58865',
        lang: 'ru_RU',
        enterprise: false,
        version: '2.1',
      },
      moscowCoords: [55.76, 37.64],
      mkadCords: mkadCoord,
      neededMkadCords: []
    }
  },
  components: { yandexMap, ymapMarker },
  methods: {
    newMarker(e) {
      //Получаем координаты точки, на которую кликнули.
      this.markerCords = e.get("coords");

      this.neededMkadCords = findClosestTo(this.mkadCords[0], this.markerCords);

      this.getAddress(this.markerCords);
      this.getRoute(this.markerCords, this.neededMkadCords);
    },
    mapLoaded(map) {
      this.ymaps = window.ymaps;
      this.map = map;
    },
    getAddress(coords) {
      this.ymaps.geocode(coords).then(function (res) {
        // Получение адреса
        let firstGeoObject = res.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.text;
        alert("Текущий адрес: " + firstGeoObject);
      })
    },
    async getRoute(coords, mkadCord) {
      /* Сейчас код ищет просто ближайщую точку мкада и прокладывает к ней и автомобильный, и воздушный маршруты.
         При желании и наличии времени можно код улучшить, отдельно выделив координаты съездов МКАДа.
         Тогда автомобильный маршрут прокладывался бы к ближайшему съезду, а не просто к точке на МКАД. */
      let carRoute = new this.ymaps.multiRouter.MultiRoute({
        referencePoints: [
          coords,
          mkadCord
        ],
        params: {
          // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
          results: 1
        }
      });
      let airRoute = new this.ymaps.GeoObject({
        geometry: {
          type: "LineString",
          coordinates: [coords,
            mkadCord
          ]
        }
      }, {
        draggable: false,
        strokeColor: "#000000",
        strokeWidth: 2
      })

      //Удаляет предыдущий маршрут.
      this.map.geoObjects.splice(1, 2);
      //Добавляет новые маршруты на карту.
      this.map.geoObjects.add(carRoute).add(airRoute);

    }
  }
}
</script>

<style scoped>
  #yandexMap {
    width: 100%;
    height: 100vh;
  }
</style>


