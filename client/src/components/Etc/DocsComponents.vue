<script setup>
const props = defineProps({
  href: String,
})

import ComponentsImg from '@/assets/images/components.webp'
</script>

<template>
  <div class="bg-primary bg-opacity-10 border border-2 border-primary rounded mb-4">
    <div class="row d-flex align-items-center p-3 px-xl-4 flex-xl-nowrap">
      <div class="col-xl-auto col-12 d-none d-xl-block p-0">
        <img
          class="img-fluid"
          :src="ComponentsImg"
          width="160px"
          height="160px"
          alt="CoreUI PRO hexagon"
        />
      </div>
<<<<<<< .merge_file_uu83Jo
      <!-- <div class="col-md col-12 px-lg-4">
=======
      <div class="col-md col-12 px-lg-4">
>>>>>>> .merge_file_HoOaX0
        Our Admin Panel isn’t just a mix of third-party components. It’s
        <strong>
          the only open-source Vue dashboard built on a professional, enterprise-grade UI Components
          Library
        </strong>
        . This component is part of this library, and we present only the basic usage of it here. To
        explore extended examples, detailed API documentation, and customization options, refer to
        our docs.
<<<<<<< .merge_file_uu83Jo
      </div> -->
      <!-- <div class="col-md-auto col-12 mt-3 mt-lg-0">
=======
      </div>
      <div class="col-md-auto col-12 mt-3 mt-lg-0">
>>>>>>> .merge_file_HoOaX0
        <a
          class="btn btn-primary text-nowrap text-white"
          :href="`https://coreui.io/vue/docs/${props.href}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore Documentation
        </a>
<<<<<<< .merge_file_uu83Jo
      </div> -->
=======
      </div>
>>>>>>> .merge_file_HoOaX0
    </div>
  </div>
</template>
