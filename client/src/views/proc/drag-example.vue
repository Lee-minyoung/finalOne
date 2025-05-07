<!-- https://sortablejs.github.io/vue.draggable.next/#/simple -->
<template>
  <div>
    <table border="1" cellspacing="0" cellpadding="5">
      <thead>
        <tr>
          <th>드래그</th>
          <th>순서</th>
          <th>이름</th>
        </tr>
      </thead>
      <draggable tag="tbody" :list="people" handle=".handle" @end="onDragEnd" item-key="id">
        <template #item="{ element, index }">
          <tr>
            <td class="handle" style="cursor: grab;">
              <i class="bi bi-chevron-expand"></i>
            </td>
            <td style="cursor: move;">{{ index + 1 }}</td>
            <td>{{ element.name }}</td>
          </tr>
        </template>
      </draggable>
    </table>
    <button @click="saveOrder">서버에 저장</button>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import axios from 'axios' // 실제 API 전송을 원할 경우 필요

export default {
  name: 'DraggableTable',
  components: {
    draggable
  },
  data() {
    return {
      people: [
        { id: 101, name: '철수', order: 1 },
        { id: 102, name: '영희', order: 2 },
        { id: 103, name: '민수', order: 3 }
      ]
    };
  },
  methods: {
    onDragEnd() {
      // 드래그로 순서가 바뀌었을 때 order 재설정
      this.people.forEach((person, index) => {
        person.order = index + 1;
      });
    },
    saveOrder() {
      // id + order만 뽑아서 서버에 보낼 준비
      const payload = this.people.map(p => ({
        id: p.id,
        order: p.order
      }));

      console.log('서버로 보낼 데이터:', payload);

      // 실제 서버로 보내려면 axios 사용
      // axios.post('/api/save-order', payload)
      //   .then(response => {
      //     console.log('저장 성공:', response.data);
      //   })
      //   .catch(error => {
      //     console.error('저장 실패:', error);
      //   });
    }
  }
}
</script>

<style scoped>
table {
  width: 300px;
  margin-top: 10px;
}

button {
  margin-top: 10px;
}

.handle {
  cursor: grab;
  font-size: 1.2rem;
  color: #6c757d;
}
</style>
