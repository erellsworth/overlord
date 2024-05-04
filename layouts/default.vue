<template>
  <div>
    <b-navbar type="is-dark">
      <template #start>
        <b-navbar-item tag="nuxt-link" to="/"> Home </b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/content"> Content </b-navbar-item>
        <b-navbar-item tag="nuxt-link" to="/media"> Media </b-navbar-item>
      </template>
    </b-navbar>

    <section class="main-content columns">
      <div class="container column is-10">
        <Nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
