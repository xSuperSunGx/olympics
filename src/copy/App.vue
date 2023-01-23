<!---->


<template xmlns="http://www.w3.org/1999/html">
  <br>
  <div class="container">
    <div class="row">
      <div class="col-md-lg">
        <h1 class="text-center">{{title}}</h1>
      </div>
    </div>
    <br>
    <div class="row justify-content-center">
    
      <div class="col-4 my-auto">
        <div class="form-row row justify-content-center">
          <div class="form-group">
            <label for="r">Select Region</label>
            <select class="form-select form-control" id="r" v-model="region" @change="reveal()">
              <option v-for="r in regions">
                {{ r.region }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-row row justify-content-center">
          <div class="form-group">
            <label for="e">Select Event</label>
            <select class="form-select form-control" id="e" v-model="event" disabled @change="search()">
              <option v-for="e in events">
                {{ e.event }}
              </option>
            </select>
          </div>
        </div>
        <br>
        <div class="form-row row justify-content-center">
          <div class="col-auto">
            <button :id="id_clear" class="btn btn-outline-danger changeVisibility" @click="clear()">Clear</button>
          </div>
        </div>
      </div>
      <div class="col-xl-7 changeVisibility" :id="id_medals">
        <VuePlotly :data="p2" :layout="layout"/>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col-md-lg">
        <h1 class="text-center">{{title_graph}}</h1>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col-xxl-12">
        <DataTable class="table" :data="input" width="100%">
          <thead>
          <tr>
            <th v-for="c in columns">
              {{ c }}
            </th>
          </tr>
          </thead>
          <tfoot>
          </tfoot>
        </DataTable>
      </div>
    </div>
  </div>
</template>
<script>

import axios from 'axios'
import DataTable from 'datatables.net-vue3'
import DataTablesLib from 'datatables.net-bs5'
import {VuePlotly} from 'vue3-plotly'


export default {
  name: 'App',
  components: {
    DataTable,
    VuePlotly,
  },
  data() {
    return {
      title: 'Olympic Search',
      title_graph: 'Statistics',
      columns: ['Age', 'Height', 'ID', 'Name', 'NOC', 'Sex','Weight',],
      regions: [],
      region: '',
      events: [],
      event: '',
      input: [],
      p2: [],
      layout: {
        title: "Medals"
      },
      id_medals: "medals",
      id_clear: "clear",
      op_medals: 1.0,
      op_clear: 1.0,
    }
  },
  setup() {
    DataTable.use(DataTablesLib);
  },
  methods: {
    getNoc(region) {
      for(let i = 0; i < this.regions.length; i++) {
        if (this.regions[i].region === region) {
          return this.regions[i].noc;
        }
      }
    },
    clear() {
      this.region = '';
      this.event = '';
      this.input = [];
      document.getElementById('e').disabled = true;
      this.invisible(this.id_medals);
      this.invisible(this.id_clear);
      //document.getElementById('medals').hidden = true;
      this.op_medals = 0.0;
      this.op_clear = 0.0;
    },
    invisible(id) {
      document.getElementById(id).classList.remove('visible');
    },
    visible(id) {
      document.getElementById(id).classList.add('visible');
    },
    resetClear() {
      //document.getElementById('clear').hidden = false;
      //document.getElementById('medals').hidden = false;
      this.visible(this.id_clear);
    },
    async reveal() {
      this.resetClear();
      if (this.region != '') {
        document.getElementById('e').disabled = false;
        if(this.event != '') {
          await this.search();
        }
      }
    },
    async search() {
      this.resetClear();
      let noc = this.getNoc(this.region);
      let url = 'http://localhost:5000/event_by_noc/' + noc;
      let response = await axios.get(url);
      let c = [];
      JSON.parse(JSON.stringify(response.data), function (key, value) {
        if (typeof key === 'string' && c.indexOf(key) === -1 && key.length > 2 && !key.startsWith(1)) {
          c.push(key);
        }
      });
      let e = [];
      for(let i = 0; i < response.data.length; i++) {

        e.push([response.data[i].age, response.data[i].height, response.data[i].id, response.data[i].name, response.data[i].noc,
          response.data[i].sex, response.data[i].weight]);
      }
      url = 'http://localhost:5000/medals2/' + noc;
      response = await axios.get(url);
      this.p2 = JSON.parse(JSON.stringify(response.data));
      this.visible(this.id_medals);
      console.log(response.data);
      console.log(response.data[0].x);
      console.log(this.p2);
      this.columns = c;
      this.input = e;
      console.log(this.p2)
    }
  },
  async mounted() {
    const response_r = await axios.get('http://localhost:5000/regions');
    const response_e = await axios.get('http://localhost:5000/events');
    this.regions = response_r.data;
    this.events = response_e.data;
    console.log(this.events)
  }

}
</script>

<style>
@import 'bootstrap';
#clear {
  width: 100px;
}
.container {
  max-width: 1000px;

}

.changeVisibility {
  visibility: hidden;
  opacity: 0;
  transition-property: visibility, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}

.visible {
  visibility: visible;
  opacity: 1;
}








</style>