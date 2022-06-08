<!-- IMPORT sdlms/assets/sidebar.tpl -->
<div class="w-100 d-flex justify-content-end mb-4 col-12">
    <button type="button" data-toggle="modal" data-target="#spreadsheetModal" class="sdlms-button button-primary button-lg d-flex align-items-center">
        New SpreadSheet
    </button>
</div>
<div id="assetsContainer">
        <div class="col-12">
            <div class="row" id="assets-rows">
               
            </div>
        </div>
</div>
<div class="modal modal_outer right_modal fade sheet" id="spreadsheetModal" tabindex="-1" role="dialog" aria-labelledby="spreadsheetLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content border-0 py-0 rounded-0">
            <div class="modal-body get_quote_view_modal_body overflow-auto p-0 rounded-0 pb-5"  id="spreadsheet"></div>
        </div>
    </div>
</div>
<div class="modal modal_outer right_modal fade sheet" id="editspreadsheetModal" tabindex="-1" role="dialog" aria-labelledby="editspreadsheetModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content border-0 py-0 rounded-0">
            <div class="modal-body get_quote_view_modal_body overflow-auto p-0 rounded-0 pb-5"  id="editspreadsheet"></div>
        </div>
    </div>
</div>
<!-- IMPORT sdlms/assets/navigation.tpl -->