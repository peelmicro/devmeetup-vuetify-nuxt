export default function (context) {
  if (!context.store.getters.user) {
    context.redirect('/user/signin')
  }
}
