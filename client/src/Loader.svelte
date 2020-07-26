<style>
  .loader {
    border: 2px solid #f3f3f3; /* Light grey */
    border-top: 2px solid #3498db; /* Blue */
    border-bottom: 2px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 15px;
    height: 15px;
    animation: spin 2s linear infinite;
    margin-top: -20px;
    margin-bottom: auto;
    float: right;
    /* background-color: rgba(45, 161, 45, 0.10); */
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<main>
  <div class="loader" />
</main>
