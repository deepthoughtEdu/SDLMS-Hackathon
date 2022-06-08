<!-- IMPORT sdlms/assets/sidebar.tpl -->
<div class="w-100 d-flex justify-content-end mb-4 col-12">
    <button type="button" data-toggle="modal" data-target="#articleModal" class="sdlms-button button-primary button-lg d-flex align-items-center">
        New Article
    </button>
</div>
<div id="assetsContainer">
        <div class="col-12">
            <div class="row" id="assets-rows">
               
            </div>
        </div>
</div>
<div class="modal modal_outer right_modal fade" id="articleModal" tabindex="-1" role="dialog" aria-labelledby="articleLabel">
    <div class="modal-dialog arModal" role="document">
        <div class="modal-content border-0 py-0 rounded-0">
            <div class="modal-body get_quote_view_modal_body overflow-auto p-0 rounded-0 pb-5"  id="article"></div>
        </div>
    </div>
</div>
<div class="modal modal_outer right_modal fade" id="editarticleModal" tabindex="-1" role="dialog" aria-labelledby="editarticleModalLabel">
    <div class="modal-dialog arModal" role="document">
        <div class="modal-content border-0 py-0 rounded-0">
            <div class="modal-body get_quote_view_modal_body overflow-auto p-0 rounded-0 pb-5"  id="editarticle"></div>
        </div>
    </div>
</div>
<!-- IMPORT sdlms/assets/navigation.tpl -->