<template>
    <div class="container">
        <form>
            <div class="form-group">
                <label for="id">아이디:</label>
                <input type="text" class="form-control" id="id" v-model="loginInfo.id">
            </div>
            <div class="form-group">
                <label for="pwd">비밀번호:</label>
                <input type="password" class="form-control" id="pwd" v-model="loginInfo.pwd">
            </div>
            <button type="button" class="btn btn-info" v-on:click="userLogin">로그인</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
// pinia로 관리하는 store(저장소) 중 필요한 저장소를 가져옴
import { useUserStore } from '../../store';
// store(저장소) 중 actions 정보를 가져올 함수
import { mapActions } from 'pinia';
export default {
    data() {
        return {
            loginInfo: {},
        }
    },
    methods: {
        // 저장소가 가지고 있는 actions 중 필요한 함수만 가져옴
        // => store(저장소) 정보를 가지고 있는 변수를 구조분해할당할 경우 반응성이 끊어짐
        ...mapActions(useUserStore, ['addLoginId']),
        async userLogin() {
            let result = await axios.post(`/api/login`, this.loginInfo)
                .catch(err => console.log(err));
            let loginRes = result.data;
            if (loginRes.result) {
                // 로그인한 정보를 store(저장소)에 저장하는 addLogindId() 호출
                this.addLoginId(loginRes.id);
                this.$router.push({ name: 'bookList' });
            } else {
                alert(loginRes.message);
            }
        }
    }
}
</script>
