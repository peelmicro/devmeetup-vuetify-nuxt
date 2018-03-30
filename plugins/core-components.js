import Vue from 'vue'

import ErrorAlert from '@/components/Shared/ErrorAlert'
import EditMeetupDetailsDialog from '@/components/Meetups/EditMeetupDetailsDialog.vue'
import EditMeetupDateDialog from '@/components/Meetups/EditMeetupDateDialog.vue'
import EditMeetupTimeDialog from '@/components/Meetups/EditMeetupTimeDialog.vue'
import RegisterMeetupDialog from '@/components/Meetups/RegisterMeetupDialog.vue'

Vue.component('err-alert', ErrorAlert)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-register-dialog', RegisterMeetupDialog)
