<template>
  <div class="Datapackage creator tile is-ancestor is-vertical">
    <div class="columns-types tile is-parent">
      <div class="tile is-parent">
        <dragcolumns class="tile is-child box" title="Categories" :list.sync="categories" :options="{group:'column'}"></dragcolumns>
      </div>
      <div class="tile is-parent">
        <dragcolumns class="tile is-child box" title="Possible Keys" :list.sync="keys" :options="{group:'column'}"></dragcolumns>
      </div>
      <div class="tile is-parent">
        <dragcolumns class="tile is-child box" title="Integers" :list.sync="ints" :options="{group:'column'}"></dragcolumns>
      </div>
      <div class="tile is-parent" v-if="floats.length > 0">
        <dragcolumns class="tile is-child box" title="Reals" :list.sync="floats" :options="{group:'column'}"></dragcolumns>
      </div>
    </div>

    <div class="container">
    <b-dropdown>
       <button class="button is-primary" slot="trigger">
           <span>Add Dimension</span>
           <b-icon icon="plus"></b-icon>
       </button>
       <b-dropdown-item @click="addDimension('administration')">Administrative Classification</b-dropdown-item>
       <b-dropdown-item @click="addDimension('economic')">Economic Classification</b-dropdown-item>
       <b-dropdown-item @click="addDimension('functional')">Functional Classification</b-dropdown-item>
       <b-dropdown-item @click="addDimension('other')">Other</b-dropdown-item>
       <b-dropdown-item>Entity</b-dropdown-item>
       <b-dropdown-item>Fact</b-dropdown-item>
       <b-dropdown-item>Location</b-dropdown-item>
    </b-dropdown>
    </div>

    <div class="tile is-ancestor is-vertical">
      <div class="tile is-parent" v-for="i in dimensionsRows + 1">
        <div class="tile is-parent">
          <div class="tile is-parent" v-for="j in 5" v-if="j - 1 + (i - 1)*5 < dimensions.length">
            <dragcolumns class="tile is-child" :keys.sync="dimensions[(i - 1)*5 + j - 1]['keys']" :type="dimensions[(i - 1)*5 + j - 1]['type']" :title="dimensions[(i - 1)*5 + j - 1]['title']" :list.sync="dimensions[(i - 1)*5 + j - 1]['list']" :options="{group:'column'}"></dragcolumns>
          </div>
          <div class="tile is-parent" v-for="j in 5" v-if="j - 1 + (i - 1)*5 >= dimensions.length">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import draggable from 'vuedraggable'
import dragcolumns from './ColumnsComponent'
import 'buefy/lib/buefy.css'
import '../../static/css/font-awesome.min.css'

import axios from 'axios'

export default {
  name: 'datapackage-creator',
  components: { draggable, dragcolumns },
  data () {
    return {
      apiRequestUrl: 'http://localhost:5000/columns',
      columns: {},
      categories: [],
      ints: [],
      floats: [],
      keys: [],
      administrations: [],
      functions: [],
      economics: [],
      amounts: [],
      dates: [],
      dimensions: [],
      dimensionConfig: {
        'other': { 'title': 'Other', 'list': [], 'keys': [], 'type': 'other' },
        'administration': { 'title': 'Administrative Classification', 'list': [], 'keys': [], 'type': 'classification' },
        'economic': { 'title': 'Economic Classification', 'list': [], 'keys': [], 'type': 'classification' },
        'functional': { 'title': 'Functional Classification', 'list': [], 'keys': [], 'type': 'classification' },
        'measure': { 'title': 'Measure', 'list': [], 'keys': [], 'type': 'measure' },
        'date': { 'title': 'Date', 'list': [], 'keys': [], 'type': 'date' }
      }
    }
  },

  computed: {
    dimensionsRows: function () {
      return Math.floor(this.dimensions.length / 5)
    }
  },

  methods: {
    addColumn: function (columnName, columnGroup) {
      let newColumn = {}
      newColumn['label'] = columnName
      newColumn['info'] = this.columns[columnName]
      columnGroup.push(newColumn)
    },

    addDimension: function (dimensionName) {
      var newDimension = {}
      Object.assign(newDimension, this.dimensionConfig[dimensionName])
      // this.dimensions = [newDimension, ...this.dimensions]
      this.dimensions.push(newDimension)
    }

  },

  mounted () {
    this.addDimension('administration')
    this.addDimension('economic')
    this.addDimension('functional')
    this.addDimension('date')
    this.addDimension('measure')

    return axios.get(this.apiRequestUrl).then(response => {
      this.columns = response.data
      for (var col in this.columns) {
        if (this.columns[col]['type'] === 'CATEGORY') {
          this.addColumn(col, this.categories)
          this.categories.sort((a, b) => a.uniques - b.uniques)
        } else if (this.columns[col]['type'] === 'INT') {
          if (!this.columns[col]['has_equivalent']) {
            this.addColumn(col, this.ints)
          } else {
            this.addColumn(col, this.keys)
          }
        } else if (this.columns[col]['type'] === 'FLOAT') {
          this.addColumn(col, this.floats)
        }
      }
      console.log(this.columns, this.categories)
    })
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.dragArea {
   min-height: 10px;
   background-color: #eee;
}

.administration {
  background-color: #ededed;
  min-height: 20px;
}
</style>
