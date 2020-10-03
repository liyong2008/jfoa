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

import { HttpParams } from "@angular/common/http";
import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { LangChangeEvent } from "@ngx-translate/core/lib/translate.service";
import { NotifyAllClientService } from "./common/client/notify-all-client.service";
import { CustomerUrlConstants } from "./common/constants/url/customer-url-constants";
import { ComponentTool } from "./common/util/component-tool";
import { LocalStorage } from "./common/util/local-storage.util";
import { BaseSubscription } from "./widget/base/BaseSubscription";
import { ModelService } from "./widget/services/model.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent extends BaseSubscription implements OnInit, OnDestroy {
   notification: string;

   constructor(private zone: NgZone,
               private modalService: NgbModal,
               private modelService: ModelService,
               private translateService: TranslateService,
               private notifyService: NotifyAllClientService)
   {
      super();

      this.subscriptions.add(this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
         const params = new HttpParams()
            .set("jfLang", event.lang);
         this.modelService.getModel(CustomerUrlConstants.PING, params).subscribe();
      }));

      const lang = this.translateService.getBrowserLang();
      const userLang = LocalStorage.getItem(LocalStorage.USER_DEFINE_LANG);

      if(!!userLang) {
         this.translateService.use(userLang);
      }
      else if(!!lang && lang != this.translateService.getDefaultLang()) {
         this.translateService.use(lang);
      }

      this.subscriptions.add(notifyService.getMessageChannel().onReceiveMessage().subscribe((message: string) => {
         if(this.notification == message || !!!message) {
            return;
         }

         this.notification = message;

         if(!!this.notification) {
            this.zone.runTask(() => {
               ComponentTool.showMessageDialog(this.modalService, "Notification", this.notification)
                  .then(() =>
                  {
                     this.notification = null;
                  });
            });
         }
      }));
   }

   ngOnInit(): void {
      document.body.className += " app-loaded";
   }
}
