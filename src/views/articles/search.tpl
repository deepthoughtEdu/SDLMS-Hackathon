<div class="container mt-5">
    <div search-bar class="mx-auto sdlms-article-search-bar">
        <form class="d-flex sdlms-search-bar justify-content-center">
            <input type="search" name="term" placeholder="Search for Articles..." class="sdlms-text-tertiary-16px p-2 rounded">
            <button type="submit" class="ml-2">
                <i class="fas fa-search"></i>
            </button>
        </form>
    </div>

    <div class="sdlms-articles-section-heading mb-2">
        <span class="font-weight-700">Results</span> for "{query}"
    </div>
    <div class="mb-2 sdlms-text-black-25px">
        <span class="font-weight-500">Found</span> {total} result(s)
    </div>


    <div class="row mt-3" id="assets-rows">
        
    </div>
</div>

<!-- IMPORT sdlms/assets/navigation.tpl -->