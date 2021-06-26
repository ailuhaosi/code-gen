/**
 * Copyright (c) gd All rights reserved.
 * 版权所有，侵权必究！
 */

package io.gd.controller;

import io.gd.dto.DownloadSourceCodeParamDTO;
import io.gd.service.SysGeneratorService;
import io.gd.utils.PageUtils;
import io.gd.utils.Query;
import io.gd.utils.R;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 代码生成器
 *
 * @author Mark sunlightcs@gmail.com
 */
@Controller
@RequestMapping("/sys/generator")
public class SysGeneratorController {
    @Autowired
    private SysGeneratorService sysGeneratorService;

    /**
     * 列表
     */
    @ResponseBody
    @RequestMapping("/list")
    public R list(@RequestParam Map<String, Object> params) {
        PageUtils pageUtil = sysGeneratorService.queryList(new Query(params));

        return R.ok().put("data", pageUtil);
    }

    /**
     * 数据库表详情
     */
    @ResponseBody
    @RequestMapping("/info")
    public R info(@RequestParam Map<String, Object> params) {
        List<Map<String, String>> columns = sysGeneratorService.queryColumns((String) params.get("tableName"));
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("list", columns);
        data.put("totalCount", columns.size());
        return R.ok().put("data", data);
    }

    /**
     * 生成代码
     */
    @PostMapping("/download-sourcecode")
    public void downLoadCode(@RequestBody DownloadSourceCodeParamDTO info, HttpServletResponse response) throws IOException {
        byte[] data = sysGeneratorService.generatorSourceCode(info.getGenPageInfo(), info.getTableName());

        response.reset();
        response.setHeader("Content-Disposition", "attachment; filename=\"gd.zip\"");
        response.addHeader("Content-Length", "" + data.length);
        response.setContentType("application/octet-stream; charset=UTF-8");

        IOUtils.write(data, response.getOutputStream());
    }
}
