<template>
    
     <div class="content-wrapper">
        <div class="row">
            <div class="col">
                <div class="card">
                <h3 class="card-header d-flex justify-content-between align-items-center">
                        Data Pengaduan
                    </h3>
                    <!--<p class="card-title float-left"><b>Data Pengaduan</b></p>
                     <p class="card-description float-right">-->
                    <div>
                              <vue-html2pdf
                                :show-layout="false"
                                :float-layout="true"
                                :enable-download="false"
                                :preview-modal="true"
                                :paginate-elements-by-height="1400"
                                filename="Invoice"
                                :pdf-quality="2"
                                :manual-pagination="true"
                                  pdf-format="a4"
                                  pdf-orientation="portrait"
                                  pdf-content-width="500px"
              
                      @hasStartedGeneration="hasStartedGeneration()"
                      @hasGenerated="hasGenerated($event)"
                      ref="html2Pdf" >
                      <section slot="pdf-content">
                          <div class="invoice-box">
                      <table>
                        <tr class="top">
                          <td colspan="2">
                            <table>
                              <tr>
                              <td class="title">
                                <img src="assets\asset\img\brand\logo.png" alt="Company logo" style="width: 100%; max-width: 150px">
                              </td>
                              <td>
                                Dengan: {{reports.nama}} <br />
                                Tanggal: <span v-if="reportt.tgl_tanggapan">{{reportt.tgl_tanggapan}}</span> <span v-else>-</span> <br />
                                Kategori: {{reportk.nama_kategori}} <br />
                                Status: {{reportp.status}}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
  
                      <tr class="heading">
                        <td>Data User</td>
                        <td> #</td>
                      </tr>

                       <tr class="details">
                        <td>NIK</td>
                        <td> {{reports.nik}} </td>
                      </tr>

                      <tr class="details">
                        <td>Nama Lengkap</td>
                        <td> {{reports.nama}} </td>
                      </tr>

                      <tr class="details">
                        <td>Username</td>
                        <td> {{reports.username}} </td>
                      </tr>

                       <tr class="details">
                        <td>Telepon</td>
                        <td> {{reports.telp}} </td>
                      </tr>

                      <tr class="heading">
                        <td>Data Pengaduan</td>

                        <td> #</td>
                      </tr>

                      <tr class="item">
                        <td>Tanggal Pengaduan</td>
                        <td> {{reportp.tgl_pengaduan}} </td>
                      </tr>

                      <tr class="item">
                        <td>Laporan</td>
                        <td> {{reportp.isi_laporan}} </td>
                      </tr>

                      <tr class="item">
                        <td>Status</td>
                        <td> <span v-if="reportp.status"> {{reportp.status}} </span> <span v-else>-</span></td>
                      </tr>
                       <tr class="item last">
                        <td>Bukti</td>
                        <td> <img v-if="reportp.foto" 
                              style="width: 300px;
                              height: 300px;
                              border-radius: 10%;" 
                              :src="'http://localhost:8000/uploads/' + reportp.foto">  
                        </td>
                      </tr>

                    </table>
                  </div>
                      </section>
                  </vue-html2pdf>
                </div>

                    <!-- Light table -->
                    <div class="table-responsive">
                        <b-table striped hover :items="pengaduan" :fields="fields" class="table align-items-center table-flush">
                            <template v-slot:cell(foto)="data">
                            <img style="width:200px; height: 150px; border-radius:5%" :src="'http://localhost:8000/uploads/' + data.item.foto" />
                            </template>
                             <template v-slot:cell(tanggapan)="data">
                                 {{ (data.item.tanggapan !== null) ? data.item.tanggapan.tanggapan :null }}
                             </template>
                             <template v-slot:cell(status)="data">
                                <b-badge class="badge badge-pill text-white" variant="primary" v-if="data.item.status === 'terkirim'">{{ data.item.status }}</b-badge>
                                <b-badge class="badge badge-pill text-white" variant="warning" v-if="data.item.status === 'proses'">{{ data.item.status }}</b-badge>
                                <b-badge class="badge badge-pill text-white" variant="success" v-if="data.item.status === 'selesai'">{{ data.item.status }}</b-badge>
                                <b-badge class="badge badge-pill text-white" variant="danger" v-if="data.item.status === 'tolak'">{{ data.item.status }}</b-badge>
                            </template>
                            <template v-slot:cell(kategori)="data">
                            <b-badge class="badge badge-pill" variant="info">{{ (data.item.kategori !== null) ? data.item.kategori.nama_kategori :null }}</b-badge>
                            </template>
                            
                            <template v-slot:cell(Aksi)="data">
                                <b-button size="sm" variant="info" v-on:click="Add(data.item)" v-b-modal.modalTanggapan>
                                <i class="mdi mdi-message"></i></b-button>&nbsp;
                                <b-button size="sm" variant="success" v-on:click="Edit(data.item)" v-b-modal.modalStatus><i class="mdi mdi-repeat"></i></b-button>
                                <br /><b-button size="sm" variant="secondary"  v-on:click="generateReport(data.item.id_pengaduan)">
                                <i class="mdi mdi-note btn-icon-prepend"></i> 
                                 </b-button>
                            </template>
                        </b-table>

                        <!-- <div class="text-center my-3">
                            <small class="text-red">{{ message }}</small>
                        </div> -->

                        <b-pagination
                        v-model="currentPage"
                        :per-page="perPage"
                        :total-rows="rows"
                        align="center"
                        v-on:input="pagination">
                        </b-pagination>

                        <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                        <b-spinner label="Spinning" variant="success"></b-spinner>
                        <strong class="text-success">Loading...</strong>
                        </b-toast>

                        <b-toast id="message" title="Message">
                        <strong class="text-success">{{ message }}</strong>
                        </b-toast>

                    </div>

                </div>
            </div>
        </div>

       <b-modal 
      id="modalTanggapan"
      @ok="Save"
    >

    <template v-slot:modal-title>
    Masukkan Tanggapan Anda Disini
    </template>
        <form ref="form">
          <div class="form-group">
            <input type="hidden" name="id_pengaduan" class="form-control" id="id_pengaduan" 
            placeholder="Isikan Id Pengaduan Disini" v-model="id_pengaduan">
          </div>
          <div class="form-group">
            <label for="tanggapan" class="col-form-label">Tanggapan</label>
            <input type="text" name="tanggapan" class="form-control" id="tanggapan" 
            placeholder="Beri Tanggapan Disini" v-model="tanggapan">
          </div>
        </form>
    </b-modal>

        <b-modal 
        id="modalStatus"
        @ok="Save"
       >
      <template v-slot:modal-title>
        Ubah Status Pengaduan
      </template>
        <form ref="form">
          <div class="form-group">
            <input type="hidden" name="id_pengaduan" class="form-control" id="id_pengaduan" 
            placeholder="Isikan Id Pengaduan Disini" v-model="id_pengaduan">
          </div>
          <div class="form-group">
            <label class="col-form-label">Status</label>
            <select class="form-control" v-model="status">
              <option value="terkirim">Terkirim</option>
              <option value="proses">Proses</option>
              <option value="selesai">Selesai</option>
              <option value="tolak">Tolak</option>
            </select>
          </div>
        </form>
    </b-modal>

    </div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'

export default {
  data : function(){
    return {
      
search: "",
      reportp: "",
      reportk: "",
      reportt: "",
      reports: "",
      id_user: "",
      nik: "",
      nama: "",
      telp: "",
      username: "",
      id_pengaduan: "",
      id_kategori: "",
      nama_kategori: "",
      tgl_pengaduan: "",
      isi_laporan: "",
      lokasi: "",
      foto: "",
      status: "",
      tanggapan: "",
      action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      perPage: 10,
      token: "",
      pengaduan: [],
      tanggapan: [],
      kategori: [],
      user: [],
      fields: ["id_pengaduan","id_user","tgl_pengaduan", "isi_laporan", "lokasi", "foto", "kategori", "status", "tanggapan", "Aksi"],
    }
  },

  components: {
        VueHtml2pdf
  },

        methods: {
    getData : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/pengaduan", conf)
      .then(response => {
        if(response.data.success){
          this.$bvToast.hide("loadingToast");
          this.pengaduan = response.data.data.pengaduan;
          // this.tanggapan = response.data.data.pengaduan.tanggapan;
          this.rows = response.data.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data pelanggaran atau anda bukan admin"
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }
        
      })
      .catch(error => {
        console.log(error.response.data.message);
      });
    },

    // pagination : function(){
    //   if(this.search == ""){
    //     this.getData();
    //   } else {
    //     this.searching();
    //   }
    // },


            getKategori : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios.get("/kategori", conf)
      .then(response => {
        if(response.data.success){
          this.$bvToast.hide("loadingToast");
          this.kategori = response.data.data.kategori;
          this.rows = response.data.data.count;
        } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data kategori."
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }        
      })
      .catch(error => {
        console.log(error);
      });
    },

    pagination : function(){
      if(this.search == ""){
        this.getData();
      } else {
        this.searching();
      }
    },


    Add : function(item){
      this.action = "insert";
      this.tanggapan = "";
      this.id_pengaduan= item.id_pengaduan;
    },

    Edit : function(item){
      this.action = "update";
      this.id_pengaduan = item.id_pengaduan;
      this.status = item.status;
    },

    generateReport (id) {
       let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
      //  console.log(id);
       this.$bvToast.show("loadingToast");
       this.axios.get("/pengaduan/" + id, conf)
       .then(response => {
          if(response.data.success == true){
          this.$bvToast.hide("loadingToast");
          this.reportp = response.data.data.pengaduan[0];
          this.reports = response.data.data.pengaduan[0].user;
          this.reportt = response.data.data.pengaduan[0].tanggapan;
          this.reportk = response.data.data.pengaduan[0].kategori;
          this.$refs.html2Pdf.generatePdf()
          } else {
          this.$bvToast.hide("loadingToast");
          this.message = "Gagal menampilkan data pengaduan."
          this.$bvToast.show("message");
          this.$router.push({name: "login"})
        }
      })
      .catch(error => {
        console.log(error.response.data.message);
      });
      console.log(this.reports)
    },
    

    Save : function(){
      let conf = { headers: { "Authorization" : 'Bearer ' + this.token } };
      this.$bvToast.show("loadingToast");
      if(this.action === "insert"){
        let form = new FormData();
        // form.append("id", this.id);
        form.append("tanggapan", this.tanggapan);
        form.append("id_pengaduan", this.id_pengaduan);

        this.axios.post("/pengaduan/tanggapan", form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          if(this.search == ""){
            this.getData();
          } else {
            this.searching();
          }
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error.response.data.message);
        });
      } else {
        let form = {
          id_pengaduan: this.id_pengaduan,
          status: this.status,
        }
        this.axios.post("/pengaduan/status", form, conf)
        .then(response => {
          this.$bvToast.hide("loadingToast");
          this.getData();
          this.message = response.data.message;
          this.$bvToast.show("message");
        })
        .catch(error => {
          console.log(error.response.data.message);
        });
      }
    },

    
  },
        //     Drop : function(id){
        //         let conf = { headers: { "Authorization" : "Bearer " + this.token} };
        //         if(confirm('Apakah anda yakin ingin menghapus data ini?')){
        //             this.message = "Mohon tunggu...";
        //             this.axios.delete("/pengaduan/" + id, conf)
        //             .then(response => {
        //                 this.getData();
        //                 this.message = "";
        //             })
        //             .catch(error => {
        //                 console.log(error);
        //             });
        //         }
        //     },
        // },
        mounted(){
        this.token = localStorage.getItem("Authorization");
        this.getData();
        this.getKategori();
  }
}
</script>

<style scoped>
body {
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				text-align: center;
				color: #777;
			}

			body h1 {
				font-weight: 300;
				margin-bottom: 0px;
				padding-bottom: 0px;
				color: #000;
			}

			body h3 {
				font-weight: 300;
				margin-top: 10px;
				margin-bottom: 20px;
				font-style: italic;
				color: #555;
			}

			body a {
				color: #06f;
			}

			.invoice-box {
				max-width: 800px;
				margin: auto;
				padding: 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 16px;
				line-height: 24px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
				border-collapse: collapse;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 40px;
			}

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}
</style>