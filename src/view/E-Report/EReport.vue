<template>
  <div>
    <Card>
      <h2 slot="title">古树电子档案</h2>
      <Table :columns="columns" :data="tableData" border :stripe="true" highlight-row></Table>
    </Card>

<!--      <PdfModal-->
<!--        :show="showPdfModal"-->
<!--        @onOK="onShowPdfModalOK"-->
<!--        @onCancel="onShowPdfModalCancel"-->
<!--        :pdf-src="this.pdfSrc"-->
<!--      ></PdfModal>-->


  </div>

</template>

<script>


import {getFileBlob, queryEReports} from "@/api/eReport";


export default {
name: "EReport",

  data(){
  return{
    // pdf: 'http://49.232.244.63:5005/eReport/pdf/61052700081.pdf'
    showPdfModal: false,
    pdfSrc: '',
    tableData: [],
    columns: [
      {
        title: '古树编号',
        align: 'center',
        key: 'tree_code',
        resizable: true,
        sortable: true,
        sortType: 'asc',
        fixed: 'left',
        render: function (h, params) {
          return h('span', params.row.tree_code)
        }
      },
      {
        title: 'word文档名称',
        align: 'center',
        resizable: true,
        // width: 100,
        render: function (h, params) {
          return h('span', params.row.word_name)
        }
      },
      {
        title: '操作',
        align: 'center',
        width: '220px',

        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              style: {
                marginRight: '2px'
              },
              on: {
                click: () => {
                  this.$router.push({
                    path: 'word',
                    query:{
                      src: params.row.word_path
                    }
                  })

                }
              }
            }, '预览'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '2px'
              },
              on: {
                click: () => {
                  this.downloadWord(params.row.word_path)
                }
              }
            }, '下载'),
          ])
        }
      },
      {
        title: 'pdf文档名称',
        align: 'center',
        resizable: true,
        // width: 115,
        render: function (h, params) {
          return h('span', params.row.pdf_name)
        }
      },

      {
        title: '操作',
        align: 'center',
        width: '220px',

        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              style: {
                marginRight: '2px'
              },
              on: {
                click: () => {
                  this.$router.push({
                    path: 'pdf',
                    query:{
                      src: params.row.pdf_path
                    }
                  })
                }
              }
            }, '预览'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '2px'
              },
              on: {
                click: () => {
                  this.downloadPdf(params.row.pdf_name)

                }
              }
            }, '下载'),
          ])
        }
      },


      {
        title: '更新时间',
        align: 'center',
        // width: '150px',
        resizable: true,
        render: function (h, params) {
          return h('span', params.row.update_time)
        }
      },

    ],
  }
  },
  created() {
  this.fetchData()

  },
  methods:{
    fetchData: function () {
      // 数据表发生变化请求数据

      let args = {  }

      return queryEReports(args).then((resp) => {
        this.tableData = resp.data.eReports

      })
    },

    downloadWord(url){
      window.location.href = url
    },
    async downloadPdf(name) {
      const res = await getFileBlob({filename: name, type: 'pdf'})
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      },

    onShowPdfModalOK(){
      this.showPdfModal = false
      this.pdfSrc = ''
    },
    onShowPdfModalCancel(){
      this.showPdfModal = false
      this.pdfSrc = ''
    }


    }



}
</script>

<style scoped>

</style>
