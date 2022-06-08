<!DOCTYPE html>
<html>
	<head>
		<title>{title}</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<link rel="stylesheet" type="text/css" href="{relative_path}/assets/admin.css?{cache-buster}" />
		<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
		
		<script src="https://bossanova.uk/jspreadsheet/v4/jexcel.js"></script>
        <link rel="stylesheet" href="https://bossanova.uk/jspreadsheet/v4/jexcel.css" type="text/css" />
 
        <script src="https://jsuites.net/v4/jsuites.js"></script>
        <link rel="stylesheet" href="https://jsuites.net/v4/jsuites.css" type="text/css" />

		<script>
			var config = JSON.parse('{{configJSON}}');
			var app = {
				user: JSON.parse('{{userJSON}}'),
				config: JSON.parse(decodeURIComponent("{{adminConfigJSON}}")),
				flags: {},
				inAdmin: true
			};
		</script>

		<script type="text/javascript" src="{relative_path}/assets/acp.min.js?{cache-buster}"></script>

		<!-- BEGIN scripts -->
		<script type="text/javascript" src="{scripts.src}"></script>
		<!-- END scripts -->
	</head>

	<body class="admin {bodyClass}">
		<!-- IMPORT admin/partials/menu.tpl -->
		<div class="container" id="content">