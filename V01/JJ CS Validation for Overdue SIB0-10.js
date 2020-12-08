/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/log', 'N/record', 'N/search','N/runtime'],
    /**
     * @param{currentRecord} currentRecord
     * @param{log} log
     * @param{record} record
     * @param{search} search
     */
    function(currentRecord, log, record, search,runtime) {


        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
            try {
                var userRole = runtime.getCurrentUser().role;
                console.log("userRole",userRole);
                var record = scriptContext.currentRecord;
                if (scriptContext.fieldId === 'entity'&& runtime.getCurrentUser().role=='1003') {
                    var customer = record.getValue({
                        fieldId: 'entity'
                    });
                    console.log("customer", customer);
                    var overdue = savedSearch(record, customer);
                    if (overdue.overdue != 0) {
                        alert("Customer Over Due of " + overdue.overdue + " Days. Exceeds Over Due limit of 0 Days");
                    }
                }
                else if (scriptContext.fieldId === 'entity'){
                    var customer = record.getValue({
                        fieldId: 'entity'
                    });
                    console.log("customer", customer);
                    var overdue = savedSearch(record, customer);
                    if (overdue.overdue != 0) {
                        alert("Customer Over Due of " + overdue.overdue + " Days. Exceeds Over Due limit of 0 Days");
                    }
                }
            }catch (e) {
                log.debug("error",e);
            }
        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {
            try{
                var record = scriptContext.currentRecord;
                var customer = record.getValue({
                    fieldId: 'entity'
                });
                console.log("customer", customer)
                var overdue = savedSearch(record, customer);
                if(runtime.getCurrentUser().role=='1003') {

                    if (overdue.overdue != 0) {
                        alert("Customer Over Due of " + overdue.overdue + " Days. Exceeds Over Due limit of 0 Days");
                        return false;
                    } else {
                        return true;
                    }
                }

                else if(overdue.overdue != 0){
                    alert("Customer Over Due of " + overdue.overdue + " Days. Exceeds Over Due limit of 0 Days");
                    return true;
                }
                else {
                    return true;
                }
            }catch (e) {
                log.debug("error",e);
            }

        }
        function savedSearch(record,customer){
            var overdue;
            var customerSearchObj = search.create({
                type: "customer",
                filters:
                    [
                        ["internalid","anyof",customer]
                    ],
                columns:
                    [
                        search.createColumn({name: "daysoverdue", label: "Days Overdue"})
                    ]
            });
            customerSearchObj.run().each(function (result) {
                overdue =  result.getValue({
                    name: 'daysoverdue'
                });
                console.log("overdue",overdue);
            });
            return{overdue:overdue}
        }
        return {
            fieldChanged: fieldChanged,
            saveRecord: saveRecord,
            savedSearch:savedSearch
        };

    });
