
import { mapState, mapMutations,mapActions} from "vuex";

export default {
  computed: {
    ...mapState({
      userInfo: state => state.user,
      username: state => state.user.userInfo.username
      // roles: state => state.user.userInfo.role_names,
    })
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ])
  }
}
