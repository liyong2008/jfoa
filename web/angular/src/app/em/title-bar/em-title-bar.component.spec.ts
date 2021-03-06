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

import { TestBed, waitForAsync } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { of, Subject } from "rxjs";
import { ModelService } from "../../widget/services/model.service";
import { PrincipalService } from "../../widget/services/principal-service";
import { EmTab, EmTitleBarService } from "../service/em-title-bar.service";
import { EmTitleBarComponent } from "./em-title-bar.component";

describe("EmTitleBarComponent", () => {

   let router: any;
   let modelService: any;
   let emTitleBarService: any;
   let principalService: any;
   let translate: any;

   beforeEach(waitForAsync(() => {
      principalService = { refresh: jest.fn() };
      modelService = { getModel: jest.fn(() => of(null)) };
      emTitleBarService = { changeTab: jest.fn() };
      emTitleBarService.currentTab = EmTab.MONITOR;

      translate = {
         get: jest.fn(() => of({})),
         getBrowserLang: jest.fn(() => of("en")),
         onLangChange: new Subject(),
         onTranslationChange: new Subject(),
         onDefaultLangChange: new Subject(),
         getTranslation: jest.fn(),
         instant: jest.fn(() => ""),
         use: jest.fn(() => of({}))
      };

      router = {
         navigateByUrl: jest.fn()
      };

      TestBed.configureTestingModule({
         imports: [
            BrowserModule,
            RouterTestingModule,
            MatToolbarModule,
            MatButtonModule,
            MatMenuModule,
            MatDividerModule,
            MatDialogModule,
            MatIconModule,
            TranslateModule
         ],
         declarations: [
            EmTitleBarComponent
         ],
         providers: [
            {
               provide: ModelService,
               useValue: modelService
            },
            {
               provide: EmTitleBarService,
               useValue: emTitleBarService
            },
            {
               provide: PrincipalService,
               useValue: principalService
            },
            {
               provide: TranslateService,
               useValue: translate
            },
            {
               provide: Router,
               useValue: router
            }
         ]
      }).compileComponents();
   }));

   it("should create the app", waitForAsync(() => {
      const fixture = TestBed.createComponent(EmTitleBarComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
   }));
});
