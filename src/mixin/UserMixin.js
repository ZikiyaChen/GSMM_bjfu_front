
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      userInfo: state => state.user,
      username: state => state.user.userInfo.username,
      access: state => state.user.userInfo.role_names,
      is_dc: state => state.user.userInfo.is_dc,
      unit: state => state.user.userInfo.unit,
      is_yh: state => state.user.userInfo.is_yh,
    })
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ])
  }
}
