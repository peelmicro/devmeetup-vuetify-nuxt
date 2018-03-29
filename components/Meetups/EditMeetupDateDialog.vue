<template>
  <v-dialog
    width="350px"
    persistent
    v-model="editDialog"
  >
    <v-btn accent slot="activator">
      Edit Date
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Date</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-date-picker v-model="editableDate" style="width: 100%" actions>
              <v-btn 
                class="blue--text darken-1" 
                flat 
                @click="editDialog = false"
              >Close</v-btn>
              <v-btn 
                class="blue--text darken-1" 
                flat 
                @click="onSaveChanges"
              >Save</v-btn>     
            </v-date-picker>
          </v-flex>
        </v-layout>   
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
function formatDate (date) {
  var d = new Date(date)
  var month = '' + (d.getMonth() + 1)
  var day = '' + d.getDate()
  var year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}
// function formatTime (date) {
//   var d = new Date(date)
//   return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
// }
export default {
  props: ['meetup'],
  data () {
    return {
      editDialog: false,
      editableDate: null
    }
  },
  methods: {
    onSaveChanges () {
      const newDate = new Date(this.meetup.date)
      const newDay = new Date(this.editableDate).getUTCDate()
      const newMonth = new Date(this.editableDate).getUTCMonth()
      const newYear = new Date(this.editableDate).getUTCFullYear()
      newDate.setUTCDate(newDay)
      newDate.setUTCMonth(newMonth)
      newDate.setUTCFullYear(newYear)

      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        date: newDate
      })
      this.editDialog = false
    }
  },
  created () {
    this.editableDate = formatDate(this.meetup.date)
  }
}
</script>
