<script>
  import io from "socket.io-client";

  const socket = io(
    `${document.location.protocol}//${document.location.hostname}:3005/`,
    {
      path: "/test"
    }
  );

  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fly, fade } from "svelte/transition";

  const progress = tweened(0, {
    duration: 500,
    easing: cubicOut,
    delay: 500
  });

  let completeLocations = [];
  let totalRequests = 0;
  let socketConnection = false;
  let isPreloading = false;

  socket.on("connect", () => {
    console.log("Connected with id: " + socket.id);
    socketConnection = true;
  });

  socket.on("disconnect", () => {
    socketConnection = false;
    console.log("disconnected");
  });

  socket.on("preloadedData", data => {
    // .match(/x-cache.*|x-edge.*|cache-control.*/gim
    if (data !== null) {
      data = data.toString();
      handlePreloadResults({
        "x-cache": data
          .match(/x-cache.*/gim)
          .toString()
          .split(":")[1],
        "x-edge": data
          .match(/x-edge.*/gim)
          .toString()
          .split(":")[1],
        "cache-control": data
          .match(/cache-control.*/gim)
          .toString()
          .split(":")[1],
        status: data.match(/HTTP.*\s\d+/gm).toString()
      });
    }
  });

  function handlePreloadResults(data) {
    totalRequests += 1;
    progress.update(n => n + 1);
    completeLocations = [...completeLocations, data];
  }

  let targetSite = "https://tukapravqednitestove.ml";

  function preloadDomain(domain) {
    progress.set(0);
    isPreloading = true;
    setTimeout(() => {
      isPreloading = false;
    }, 7000);
    completeLocations = [];
    socket.emit("preloadDomain", domain);
  }

  function initiateRequest() {
    // locations = locations;
    completeLocations = [];
  }
</script>

<style>

</style>

<main class="container">
  <div class="row">
    <div class="col-lg-2" />
    <div class="col-lg-8">

      <h1 class="text-center">Edge Cache Preload</h1>
      <!-- {#if socketConnection}
        <span class="float-left">Socket status: ✅</span>
      {:else}
        <span class="float-left">
          Socket status:
          <div class="spinner-grow spinner-grow-sm" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </span>
      {/if} -->

      <span class="float-right">
        Total Requests:
        <span class="badge badge-primary text-wrap">{totalRequests}</span>
      </span>

      <div class="input-group mb-3">
        <input
          bind:value={targetSite}
          type="text"
          class="form-control"
          placeholder="https://example.com/"
          disabled={isPreloading | !socketConnection} />
        <div class="input-group-append">
          {#if !isPreloading && socketConnection}
            <button
              on:click={preloadDomain(targetSite)}
              class="btn btn-outline-secondary"
              type="button">
              Preload
            </button>
          {:else if !socketConnection}
            <button class="btn btn-outline-secondary" type="button" disabled>
              <!-- <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true" /> 
                <span class="sr-only">Connecting...</span>
                -->
              <div class="spinner-grow spinner-grow-sm" role="status">
                <span class="sr-only">Connecting...</span>
              </div>
              Connecting
            </button>
          {:else}
            <button class="btn btn-outline-secondary" type="button" disabled>
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true" />
              <span class="sr-only">Loading...</span>
              Loading...
            </button>
          {/if}

        </div>

      </div>
      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          style="width: {Math.round($progress * 3.44827586207)}%;"
          aria-valuenow={$progress}
          aria-valuemin="0"
          aria-valuemax="29">
          {Math.round($progress * 3.44827586207)}%
        </div>
      </div>
    </div>
    <div class="col-lg-2" />
  </div>

  <div class="row">
    <div class="col-lg-2" />
    <div class="col-lg-8">
      <table class="table table-striped table-hover">
        <thead>
          <td>#</td>
          <td>Location</td>
          <td>X-Cache</td>
          <td>Cache-Control</td>
          <td>Status</td>
        </thead>
        <tbody>
          {#each completeLocations as location, id}
            <tr
              in:fly={{ x: 300, duration: 500 }}
              out:fly={{ x: -300, duration: 500 }}>
              <td>{id}</td>
              <td>{location['x-edge']}</td>
              <td>{location['x-cache']}</td>
              <td>{location['cache-control']}</td>
              <td>{location['status']}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</main>
