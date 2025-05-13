<template>
    <Header></Header>
    <div>
      <h2>Ajouter un livre</h2>
      <AjouterLivreForm />
      <router-link to="/">
        <button>Retour</button>
      </router-link>
    </div>
    <Footer></Footer>
  </template>
  
  <script>
  import AjouterLivreForm from '@/components/AjouterLivreForm.vue';
  import Footer from '@/components/Footer.vue';
    import Header from '@/components/Header.vue';
    
  export default {
    name: 'AjouterLivre',
    components: {
      AjouterLivreForm
    }
  };
  </script>
  