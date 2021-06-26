/**
 * Copyright (c) gd All rights reserved.
 * 版权所有，侵权必究！
 */

package io.gd.service;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import io.gd.config.MongoManager;
import io.gd.dao.GeneratorDao;
import io.gd.dao.MongoDBGeneratorDao;
import io.gd.dto.GenPageInfoDTO;
import io.gd.entity.mongo.MongoDefinition;
import io.gd.factory.MongoDBCollectionFactory;
import io.gd.utils.GenUtils;
import io.gd.utils.PageUtils;
import io.gd.utils.Query;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipOutputStream;

/**
 * 代码生成器
 *
 * @author Mark sunlightcs@gmail.com
 */
@Service
public class SysGeneratorService {
    @Autowired
    private GeneratorDao generatorDao;


    public PageUtils queryList(Query query) {
        Page<?> page = PageHelper.startPage(query.getPage(), query.getLimit());
        List<Map<String, Object>> list = generatorDao.queryList(query);
        int total = (int) page.getTotal();
        if (generatorDao instanceof MongoDBGeneratorDao) {
            total = MongoDBCollectionFactory.getCollectionTotal(query);
        }
        return new PageUtils(list, total, query.getLimit(), query.getPage());
    }

    public Map<String, String> queryTable(String tableName) {
        return generatorDao.queryTable(tableName);
    }

    public List<Map<String, String>> queryColumns(String tableName) {
        return generatorDao.queryColumns(tableName);
    }

    public byte[] generatorSourceCode(GenPageInfoDTO genPageInfo, String tableName){
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(outputStream);
        //查询表信息
        Map<String, String> table = queryTable(tableName);
        //查询列信息
        List<Map<String, String>> columns = queryColumns(tableName);
        //生成代码
        GenUtils.generatorCode(table, columns, genPageInfo, zip);
        /*if (MongoManager.isMongo()) {
            GenUtils.generatorMongoCode(tableNames, zip);
        }*/


        IOUtils.closeQuietly(zip);
        return outputStream.toByteArray();
    }
}
