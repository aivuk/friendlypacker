<template>
  <div class="card">
    <div clas="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
    </div>
    <div class="card-content">
      <div class="columns" v-if="type == 'classification'">
        <div class="column">
          <h2> Key </h2>
          <draggable v-model="mkeys" class="dragArea" :options="options">
            <div class="column_name" v-for="elem in keys">{{elem['label']}}</div>
          </draggable>
        </div>
        <div class="column">
          <h2> Label </h2>
          <draggable v-model="mlist" class="dragArea" :options="options">
            <div class="column_name" v-for="elem in list">{{elem['label']}}</div>
          </draggable>
        </div>
      </div>
      <draggable v-model="mlist" class="dragArea" :options="options" v-if="type != 'classification'">
        <div class="column_name" v-for="elem in list">{{elem['label']}}</div>
      </draggable>
    </div>
  </div>
</template>

<script>

import draggable from 'vuedraggable'

export default {

  name: 'dragcolumns',
  components: { draggable },
  props: { list: {}, title: '', keys: {}, type: '', options: {} },
  data () {
    return {
      mlist: this.list,
      mkeys: this.keys
    }
  },
  watch: {
    mlist: function (newList) {
      this.$emit('update:list', newList)
    },
    mkeys: function (newKeys) {
      this.$emit('update:keys', newKeys)
    }
  }

}

</script>

<style lang="scss">

.dragArea {
   min-height: 10px;
   background-color: #eee;
}

.column_name {

  &:hover .sortable-drag {
    background-color: rgba(0,0,0,0);
  }
}

</style>
