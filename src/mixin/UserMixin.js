
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      userInfo: state => state.user,
      username: state => state.user.userInfo.username,
      access: state => state.user.userInfo.role_names
    })
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ])
  }
}
