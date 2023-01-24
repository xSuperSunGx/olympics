<!---->


<template xmlns="http://www.w3.org/1999/html">
  <header>
    <h1 id="title" class="text-center">Olympic Search</h1>
  </header>
  <body>
  <Background/>
  <div class="mainbackground">
    <div class="container">
      <div id="top"/>
      <div class="row justify-content-center">
        <div id="sides">
          <div class="left-side lap">
            <div class="left-side-inside lap">
              <label for="r">Select Region</label>
              <select class="form-select form-control" id="r" v-model="region" @change="reveal()">
                <option v-for="r in regions">
                  {{ r.region }}
                </option>
              </select>
              <label for="e">Select Event</label>
              <select class="form-select form-control" id="e" v-model="event" disabled @change="search()">
                <option v-for="e in events">
                  {{ e.event }}
                </option>
              </select>
              <br>
              <div class="form-row row justify-content-center">
                <div class="col-auto">
                  <button :id="id_clear" class="btn btn-outline-danger changeVisibility" @click="clear()">Clear</button>
                </div>
              </div>
            </div>
          </div>
          <div class="right-side lap">
            <div :id="id_medals">
              <VuePlotly  :data="p2" :layout="layout"/>
            </div>
          </div>
        </div>
        <br>
        <div id="statistics" class="lap">
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
      </div>
    </div>
  </div>

  </body>
</template>
<script>

import axios from 'axios'
import DataTable from 'datatables.net-vue3'
import DataTablesLib from 'datatables.net-bs5'
import {VuePlotly} from 'vue3-plotly'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faUserSecret} from '@fortawesome/free-solid-svg-icons'
import Background from "@/components/Background.vue";


export default {
  name: 'App',
  components: {
    DataTable,
    VuePlotly,
    Background
  },
  data() {
    return {
      title_graph: 'Statistics',
      columns: ['Age', 'Height', 'ID', 'Name', 'NOC', 'Sex','Weight',],
      regions: [],
      region: '',
      events: [],
      event: '',
      input: [],
      p2: [],
      layout: {
        title: "Medals",
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent'
      },
      id_medals: "medals",
      id_clear: "clear",
      op_medals: 1.0,
      op_clear: 1.0,
      all_trans_secs: 0.5,

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
      this.invisible(this.id_clear);
      this.lapping(true);
      //document.getElementById('medals').hidden = true;
      //document.getElementById('clear').hidden = true;

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
    lapping(option) {
      var sides = document.getElementById('sides').children;
      var leftsideinside = sides[0].children[0];
      var statistics = document.getElementById('statistics')
      if (option) {
        for (let i = 0; i < sides.length; i++) {
          sides[i].classList.add('lap');
        }
        leftsideinside.classList.add('lap');
        statistics.classList.add('lap');

      } else {
        for (let i = 0; i < sides.length; i++) {
          sides[i].classList.remove('lap');
        }
        leftsideinside.classList.remove('lap');
        statistics.classList.remove('lap');

      }
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
      if(document.getElementsByClassName('right-side')[0].classList.contains('lap')) {
        this.lapping(false);
      }
      let b = [];
      let dic = response.data[0];
      if (dic['x'].includes('Gold')) {
        b.push('gold');
      }
      if(dic['x'].includes('Silver')) {
        b.push('silver');
      }
      if (dic['x'].includes('Bronze')) {
        b.push('#b08d57');
      }



      dic['marker'] = {'color': b};
      this.p2 = JSON.parse(JSON.stringify(response.data));
      this.columns = c;
      this.input = e;
      console.log(response.data);
      console.log(response.data[0].x);
      console.log(this.p2);
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
:root {
  --all-transition-counter: 0.5s;
  --right-transition-counter: calc(var(--all-transition-counter) / 2);
  --visible-transition-counter: 0.3s;
}
.pagination {
  --bs-pagination-color : #000;
  --bs-pagination-bg: transparent;
  --bs-pagination-active-bg: rgba(0, 0, 0, 0.25);
  --bs-pagination-active-border-color: rgba(0, 0, 0, 0.75);
  --bs-pagination-disabled-bg: rgba(0, 0, 0, 0.1);
  --bs-pagination-hover-color: #000000;
  --bs-pagination-focus-color: #000000;
  --bs-pagination-disabled-color: #000000;

  --bs-pagination-focus-box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.5);

}

#title {
  font-weight: bold;
}

.container {
  min-width: 1100px;
  background-color: rgba(255, 255, 255,0);
  overflow: scroll;
  margin-top: 60px;
  padding: 25px;
  transition: max-width var(--all-transition-counter) ease-in-out;
}

@media screen and (max-width: 1100px) {
  .container {
    min-width: 767px;
  }
}


@media screen and (max-height: 400px) {

  html {
    width: auto !important;
    width: 767px;
    overflow: auto;
  }
  html {
    height: 400px;
    overflow: auto;
  }


}




body {
  background: #eeeeee;
}
header{
  padding: 5px;
}

input select {
  background-color: rgba(255, 255, 255,0);
}

.mainbackground {
  position: absolute;
  width: 100%;
  top: 0;
  background-color: rgba(0,0,0,0);
  overflow: hidden;
  user-input: none;
}

.placeholder {
  visibility: hidden;
  opacity: 0.0;
}

.changeVisibility {
  visibility: hidden;
  opacity: 0;
  transition-property: visibility, opacity;
  transition-duration: var(--visible-transition-counter);
  transition-timing-function: ease-in-out;
}

.visible {
  visibility: visible;
  opacity: 1;
}



.left-side {
  float: left;
  width: 50%;
  height: 184.4px;

  transition: all var(--all-transition-counter) ease-in-out;
}
.left-side-inside {
  width: 70%;
}
#statistics {
  width: 100%;
  visibility: visible;
  opacity: 1;
  transition: opacity var(--all-transition-counter) ease-in-out;
}
#statistics.lap {
  visibility: hidden;
  opacity: 0;
}
.left-side-inside.lap {
  transform: translateX(0%);
}
.right-side {
  float: right;
  width: 50%;
  height: 450px;
  visibility: visible;
  opacity: 1;
  transition: all calc(var(--all-transition-counter) + var(--right-transition-counter)) ease-in-out;

}
.lap {
  left: 50%;
  transform: translateX(25%);
}
.right-side.invisible {
  visibility: hidden;
  opacity: 0;
  transition: opacity var(--visible-transition-counter) ease-in-out;
}
.right-side.lap {
  left: 50%;
  transform: translateX(25%);
  visibility: hidden;
  opacity: 0;
  transition: all calc(var(--all-transition-counter) - var(--right-transition-counter)) ease-in-out;
}

.left-side.lap {
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(50%);
}

#clear {
  width: 100px;
}


</style>