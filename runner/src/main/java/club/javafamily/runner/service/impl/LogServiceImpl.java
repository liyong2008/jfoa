package club.javafamily.runner.service.impl;

import club.javafamily.runner.common.service.ExcelService;
import club.javafamily.runner.common.filter.Filter;
import club.javafamily.runner.common.filter.DaoFilter;
import club.javafamily.runner.common.table.lens.TableLens;
import club.javafamily.runner.dao.LogDao;
import club.javafamily.runner.domain.Log;
import club.javafamily.runner.enums.ExportType;
import club.javafamily.runner.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.metamodel.Metamodel;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Service("logService")
public class LogServiceImpl implements LogService {

   @Transactional
   @Override
   public void insertLog(Log log) {
      logDao.insert(log);
   }

   @Transactional(readOnly = true)
   @Override
   public <T extends Comparable<T>> List<Log> getAll(DaoFilter<T> filter) {
      return logDao.getAll(filter);
   }

   @Transactional(readOnly = true)
   @Override
   public <R extends Comparable<R>> TableLens getTableLens(DaoFilter<R> filter) {
      return logDao.getTableLens(filter);
   }

   @Transactional(readOnly = true)
   @Override
   public <R extends Comparable<R>> void exportExcel(HttpServletResponse response,
                                                     ExportType exportType,
                                                     DaoFilter<R> filter) throws Exception
   {
      TableLens tableLens = getTableLens(filter);
      excelService.export(tableLens, response, exportType, filter, "JavaFamily Audit");
   }

   @Autowired
   public LogServiceImpl(LogDao logDao, ExcelService excelService) {
      this.logDao = logDao;
      this.excelService = excelService;
   }

   private final LogDao logDao;
   private final ExcelService excelService;
}
