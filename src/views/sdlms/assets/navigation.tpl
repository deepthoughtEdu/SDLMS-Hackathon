<nav class="sdlms-pagination" style="display:none" aria-label="pagination">
	<ul class="pagination pagination-circle justify-content-center">

		
		<li class="page-item <!-- IF !pagination.isPrev -->disabled <!-- END pagination.isPrev -->">
			<a class="page-link prev" href="{pagination.prev}" aria-label="Previous">
				<span aria-hidden="true">&laquo;</span>
				<span class="sr-only">Previous</span>
			</a>
		</li>

		<!--Numbers-->
		<span class="d-flex align-items-center">Page {pagination.current} of {pagination.total}</span>
		<li class="page-item d-none"><a class="page-link">1</a></li>
		<li class="page-item d-none"><a class="page-link">2</a></li>
		<li class="page-item d-none"><a class="page-link">3</a></li>
		<li class="page-item d-none"><a class="page-link">4</a></li>
		<li class="page-item d-none"><a class="page-link">5</a></li>

		<!--Arrow right-->
		<li class="page-item <!-- IF !pagination.isNext -->disabled <!-- END pagination.isNext -->">
			<a class="page-link next" href="{pagination.next}" aria-label="Next">
				<span aria-hidden="true">&raquo;</span>
				<span class="sr-only">Next</span>
			</a>
		</li>
	</ul>
</nav>
