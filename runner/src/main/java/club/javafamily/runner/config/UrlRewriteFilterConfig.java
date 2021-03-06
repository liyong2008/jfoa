/*
 * Copyright (c) 2020, JavaFamily Technology Corp, All Rights Reserved.
 *
 * The software and information contained herein are copyrighted and
 * proprietary to JavaFamily Technology Corp. This software is furnished
 * pursuant to a written license agreement and may be used, copied,
 * transmitted, and stored only in accordance with the terms of such
 * license and with the inclusion of the above copyright notice. Please
 * refer to the file "COPYRIGHT" for further copyright and licensing
 * information. This software and information or any other copies
 * thereof may not be provided or otherwise made available to any other
 * person.
 */

package club.javafamily.runner.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.tuckey.web.filters.urlrewrite.UrlRewriteFilter;

@Configuration
public class UrlRewriteFilterConfig {

   private static final String URL_REWRITE = "classpath:/urlrewrite.xml";

   @Value(URL_REWRITE)
   private Resource resource;

   /**
    * reset filter order, must execute after shiro filter.
    * @see ShiroConfig reset filter order
    */
   @Bean()
   @Order(2)
   public UrlRewriteFilter urlRewriteFilter() {
      return new MainUrlRewriteFilter(resource);
   }

}
