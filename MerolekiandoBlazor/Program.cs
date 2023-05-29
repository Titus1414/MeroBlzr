using Blazored.Modal;
using MerolekiandoBlazor.Data;
using MerolekiandoBlazor.Hubs;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;



var builder = WebApplication.CreateBuilder(args);


builder.Host.ConfigureAppConfiguration((hostingContext, config) =>
{
    config.AddJsonFile("appsettings.json", optional: true);
});
// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddSingleton<WeatherForecastService>();
builder.Services.AddBlazoredModal();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSignalR();
builder.Services.AddAuthentication(
    options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    //options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
    //options.DefaultForbidScheme = FacebookDefaults.AuthenticationScheme;
}
)
    .AddCookie(options => options.SlidingExpiration = true)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateActor = false,
            ValidateLifetime = true,
            NameClaimType = ClaimTypes.NameIdentifier

        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/signalServer"))) // for me my hub endpoint is ConnectionHub
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
        //GoogleDefaults.AuthenticationScheme,
    })
.AddGoogle(options =>
 {
     options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
     options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
     options.ClaimActions.MapJsonKey("urn:google:picture", "picture", "url");
     //FacebookDefaults.AuthenticationScheme, 
 }).AddFacebook(options =>
 {
     options.AppId = builder.Configuration["Authentication:Facebook:AppId"];
     options.AppSecret = builder.Configuration["Authentication:Facebook:AppSecret"];
 });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapBlazorHub();
app.MapFallbackToPage("/_Host");
app.MapHub<ChatHub>("/chathub");
app.UseEndpoints(endpoits =>
{
    endpoits.MapControllers();
});

app.Run();
