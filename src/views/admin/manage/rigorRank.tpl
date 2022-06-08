  <div class="display-flex jc-center ai-center margin-bottom-4">
    <p class="margin-right-3 margin-bottom-0">Filter By:</p>
    <select class="dropdown margin-right-3">
      <option class="dropdown__option text__black">Primary Filter</option>
      <option class="dropdown__option text__black" value="Events Attended">Events Attended</option>
      <option class="dropdown__option text__black" value="Number Of Nudges Explored">Number Of Nudges Explored</option>
      <option class="dropdown__option text__black" value="Number Of Nudges Explored">Most Events Attended</option>
      <option class="dropdown__option text__black" value="Number Of Nudges Explored">Most Activites in DR</option>
      <option class="dropdown__option text__black" value="Number Of Nudges Explored"> Most Comments Made</option>
    </select>
    <select class="dropdown text__black">
      <option class="dropdown__option text__black">Secondary Filter</option>
      <option class="dropdown__option text__black" value="In Last Day">In Last Day</option>
      <option class="dropdown__option text__black" value="In Last Week">In Last Week</option>
      <option class="dropdown__option text__black" value="In Last Month">In Last Month</option>
      <option class="dropdown__option text__black" value="Date Range Start-End">Date Range Start-End</option>
    </select>
  </div>
  <div class="container-table u-pd-top-lg">
    <table class="table table-striped">
      <thead>
        <tr class="table__tr">
          <th class="text__gray">Sno</th>
          <th class="text__gray">Username</th>
          <th class="text__gray">Rigor Rank</th>
        </tr>
      </thead>
      <tbody id="rr-display">
      </tbody>
    </table>
  </div>
  <div class="display-flex jc-center">
    <form id="csv-upload-form">
      <input id="csvInput" type="file" name="files[csv_file]" accept=".csv" class="display-none" />
      <label for="csvInput" class="btn btn-warning margin-right-4" id="upload-rr-btn">Upload CSV</label>
    </form>
    <button class="btn btn-info" id="download-rr-btn">Download Csv</button>
  </div>